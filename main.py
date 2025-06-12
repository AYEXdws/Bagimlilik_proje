import os
import time
import psycopg2
from flask import Flask, render_template, request, redirect, g, session, flash, url_for
# ESKİ KÜTÜPHANE YERİNE YENİSİNİ İÇERİ AKTARIYORUZ
from better_profanity import profanity
from werkzeug.security import generate_password_hash, check_password_hash

# --- UYGULAMA KURULUMU ---
app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY') 
DATABASE_URL = os.environ.get('DATABASE_URL')

# --- VERİTABANI İŞLEMLERİ ---
def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Veritabanı bağlantı hatası: {e}")
        return None

def setup_database():
    conn = get_db_connection()
    if conn is None:
        print("Veritabanı kurulumu atlandı: Bağlantı kurulamadı.")
        return
    with conn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            );
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS stories (
                id SERIAL PRIMARY KEY,
                author_username TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMPTZ DEFAULT NOW()
            );
        """)
    conn.commit()
    conn.close()
    print("Veritabanı tabloları kontrol edildi/oluşturuldu.")

# --- KULLANICI OTURUM YÖNETİMİ ---
@app.before_request
def before_request():
    g.user = session.get('user')

# --- ANA SAYFA ROUTE'LARI ---
# ... (index, test, etkinlikler, yardim route'ları aynı kalıyor, değişmedi)
@app.route('/')
def index(): return render_template('index.html')
@app.route('/test')
def test(): return render_template('test.html')
@app.route('/etkinlikler')
def etkinlikler(): return render_template('etkinlikler.html')
@app.route('/yardim')
def yardim(): return render_template('yardim.html')


# --- KULLANICI KAYIT/GİRİŞ/ÇIKIŞ ROUTE'LARI ---
# ... (kayit_ol, giris_yap, cikis_yap route'ları aynı kalıyor, değişmedi)
@app.route('/kayit-ol', methods=['GET', 'POST'])
def kayit_ol():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if not username or not password or len(username) < 3:
            flash("Kullanıcı adı ve parola en az 3 karakter olmalıdır.")
            return redirect(url_for('kayit_ol'))
        conn = get_db_connection()
        if not conn:
            flash("Sistemde geçici bir sorun var, lütfen sonra tekrar deneyin.")
            return redirect(url_for('kayit_ol'))
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = %s;", (username,))
            if cur.fetchone():
                flash("Bu kullanıcı adı zaten alınmış.")
            else:
                hashed_password = generate_password_hash(password)
                cur.execute("INSERT INTO users (username, password_hash) VALUES (%s, %s);", (username, hashed_password))
                conn.commit()
                flash("Kayıt başarılı! Şimdi giriş yapabilirsiniz.")
                return redirect(url_for('giris_yap'))
        conn.close()
        return redirect(url_for('kayit_ol'))
    return render_template('kayit_ol.html')

@app.route('/giris-yap', methods=['GET', 'POST'])
def giris_yap():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        conn = get_db_connection()
        if not conn:
            flash("Sistemde geçici bir sorun var.")
            return redirect(url_for('giris_yap'))
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE username = %s;", (username,))
            user = cur.fetchone()
        conn.close()
        if user and check_password_hash(user[2], password):
            session['user'] = user[1]
            return redirect(url_for('index'))
        else:
            flash("Kullanıcı adı veya parola hatalı.")
    return render_template('giris_yap.html')

@app.route('/cikis-yap')
def cikis_yap():
    session.pop('user', None)
    return redirect(url_for('index'))

# --- HİKAYE (FORUM) ROUTE'LARI ---
@app.route('/hikaye-yaz')
def hikaye_yaz():
    if not g.user:
        flash("Hikayeni paylaşmak için lütfen giriş yap.")
        return redirect(url_for('giris_yap'))
    return render_template('hikaye_yaz.html')

@app.route('/hikaye-gonder', methods=['POST'])
def hikaye_gonder():
    if not g.user: return redirect(url_for('giris_yap'))

    story_text = request.form.get('story')
    if not story_text or len(story_text) < 20:
        flash("Hikayen en az 20 karakter olmalıdır.")
        return redirect(url_for('hikaye_yaz'))

    # KÜFÜR FİLTRESİ KONTROLÜNÜ YENİ KÜTÜPHANEYE GÖRE GÜNCELLİYORUZ
    if profanity.contains_profanity(story_text):
        flash("Yazınızda uygun olmayan kelimeler tespit edildi. Lütfen düzenleyin.")
        return redirect(url_for('hikaye_yaz'))

    # Spam engelleme aynı kalıyor
    last_submission_key = f"last_submission_{g.user}"
    if time.time() - session.get(last_submission_key, 0) < 60:
        flash("Çok hızlı gönderim yapıyorsunuz. Lütfen biraz bekleyin.")
        return redirect(url_for('hikaye_yaz'))

    conn = get_db_connection()
    if not conn:
        flash("Sistemde geçici bir sorun var, hikayen kaydedilemedi.")
        return redirect(url_for('hikaye_yaz'))

    with conn.cursor() as cur:
        cur.execute("INSERT INTO stories (author_username, content) VALUES (%s, %s);", (g.user, story_text))
    conn.commit()
    conn.close()

    session[last_submission_key] = time.time()
    flash("Hikayen başarıyla paylaşıldı!")
    return redirect(url_for('index'))

# --- UYGULAMAYI ÇALIŞTIRMA ---
if __name__ == '__main__':
    setup_database()
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port)
