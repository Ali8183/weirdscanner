# GPT Weird Scanner - Vercel Template

## Nasıl deploy edilir (hızlı)
1. Yeni bir GitHub repo oluştur ve bu dosyaları koy.
2. Vercel (https://vercel.com) hesabına GitHub ile giriş yap.
3. "New Project" > GitHub repo'nu seç > Deploy.
4. Deploy tamamlandığında proje domain'i: `https://<project>.vercel.app`
5. `public/.well-known/openai.json` içindeki `api.url` ve `logo_url` içindeki `<REPLACE_WITH_YOUR_DOMAIN>` alanlarını Vercel domain'inle değiştir.
6. Yeniden deploy et (veya dosyayı editleyip push yap).
7. ChatGPT -> Settings -> Actions -> Developer -> Add Action -> Manifest URL olarak:
   `https://<project>.vercel.app/.well-known/openai.json`
8. ChatGPT eklentiyi yükleyecek; artık eklenti kullanılabilir.

## Test etmek için
POST isteği:
