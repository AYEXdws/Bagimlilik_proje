# KontrolSende — Flask uygulaması

Öğrenciler ve gençler için bağımlılık farkındalığı içerikleri, etkinlikler ve kişisel hikâye gönderimi sunan okul projesi.

Bu depo, KontrolSende'nin **Flask ve PostgreSQL kullanan sunuculu uygulamasını** içerir.

## Kapsam

- Ana sayfa, farkındalık testi, etkinlikler ve yardım sayfaları.
- Kullanıcı kaydı, giriş ve çıkış.
- Oturum açmış kullanıcının kişisel hikâye göndermesi.
- Hikâye uzunluğu, uygunsuz kelime ve gönderim aralığı kontrolleri.
- PostgreSQL'de kullanıcı ve hikâye kayıtları.

Test ve içerikler eğitim/farkındalık amaçlıdır. Sonuçlar klinik değerlendirme veya tanı olarak yorumlanmamalıdır. Mevcut kod hikâye gönderimini kaydeder; ayrı bir moderasyon paneli ya da kapsamlı forum yönetimi içermez.

## Teknoloji ve dosyalar

| Yol | Sorumluluk |
| --- | --- |
| `main.py` | Flask uygulaması, oturumlar, veritabanı işlemleri ve rotalar |
| `templates/` | Jinja sayfa şablonları |
| `static/css/` | Görsel tasarım |
| `static/js/` | Menü ve tarayıcı etkileşimleri |
| `requirements.txt` | Python bağımlılıkları |
| `Procfile` | Gunicorn başlangıç tanımı |

Flask, Werkzeug, psycopg2, Gunicorn ve better-profanity kullanılır.

## Yerel kurulum

Python 3 ve ayrı bir geliştirme PostgreSQL veritabanı gerekir.

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Uygulama değişkenleri doğrudan proses ortamından okur:

| Değişken | Amaç |
| --- | --- |
| `DATABASE_URL` | PostgreSQL bağlantısı |
| `SECRET_KEY` | Flask oturumlarının sunucu imza anahtarı |
| `PORT` | Dinleme portu; tanımlanmazsa 8080 |

Bağlantı ve imza anahtarı değerlerini Git'e eklemeyin. Bu depoda `.env` dosyasını otomatik yükleyen bir katman bulunmaz; değişkenleri uygulamayı başlatan ortamda tanımlayın.

```bash
python main.py
```

Bu komut önce `users` ve `stories` tablolarını kontrol eder/oluşturur, sonra geliştirme sunucusunu başlatır. Varsayılan adres [localhost:8080](http://localhost:8080) olur.

## Sunucu yayını

`Procfile`, `gunicorn main:app` başlangıcını tanımlar. Gunicorn modülü içe aktardığı için `__main__` bloğundaki tablo hazırlığı otomatik çalışmaz.

Yeni ve yalnız geliştirme için ayrılmış bir veritabanında başlangıç tablolarını hazırlamak için:

```bash
python -c "from main import setup_database; setup_database()"
```

Bu komut yapılandırılmış veritabanında tablo oluşturur. Üretim ortamında uygulanacak şema adımları ve veritabanı hedefi ayrıca değerlendirilmelidir.

## Doğrulama ve durum

Depoda otomatik test paketi veya test komutu bulunmaz. Değişikliklerden sonra geliştirme verisiyle kayıt, giriş, çıkış, hikâye gönderme ve sayfa gezinmesini kontrol edin.

Kaynak kodu çalıştırılabilir bir okul projesi altyapısı sunar; bu README güncel canlı servis veya üretim hazırlığı doğrulaması değildir.
