// api/weirdscan.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { text } = req.body || {};
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Missing "text" in JSON body.' });
  }

  // Basit kural tabanlı tespit — ihtiyaç halinde geliştir.
  const risks = [];
  const lower = text.toLowerCase();

  // Dil riskleri
  if (/(academic|academically|essay|scholar|peer-reviewed|objective tone)/i.test(text)) {
    risks.push('Aşırı akademik / steril dil dayatması');
  }
  if (/avoid colloquial|colloquial/i.test(text)) {
    risks.push('Gayri-doğal, mekanik üsluba yönlendirme');
  }

  // Anlam riskleri
  if (/(western|western psychological|cognitive behavioral|cbt|psychology)/i.test(text)) {
    risks.push('Batı-merkezli teori referansı (kültürel körlük riski)');
  }
  if (/(self-optimization|self-optimization|self-optimization|optimiz)/i.test(lower)) {
    risks.push('Aşırı bireyselleştirme; topluluk/ahlak boyutu gözardı edilebilir');
  }

  // Üslup riskleri
  if (/(structured|framework|frameworks|systematic|systematically)/i.test(text)) {
    risks.push('Aşırı yapılandırılmış, insan dilinden uzak üslup');
  }

  // Genel heuristikler
  if (text.length > 1500) risks.push('Uzun ve dolaylı; sadeleştirme önerilir');

  // Eğer risk yoksa notu ekleyelim
  if (risks.length === 0) risks.push('Belirgin GPT-Weird riski tespit edilmedi — yine de sadeleştirme faydalı olabilir.');

  // Temizleme: basit dönüşümler (örnek)
  function temizleForTurkIslam(s) {
    // 1) Batı-tek taraflı ifadeleri yumuşat
    let t = s.replace(/\b(Western|western|Western psychological theories?)\b/gi, 'çeşitli kuramsal bakışlar');
    // 2) "avoid colloquial" tarzı talimatları kaldır, yerine "sade ve içten" ekle
    t = t.replace(/avoid colloquial expressions/gi, 'dili sade ve içten tut');
    // 3) "objective tone" gibi ifadeleri dönüştür
    t = t.replace(/\bneutral, objective tone\b/gi, 'dili içten, hikmetli ve ölçülü tut');
    // 4) Fazla akademik isteği yumuşat
    t = t.replace(/\b(comprehensive, academically structured essay|essay|academically structured)\b/gi, 'hayattan örneklerle desteklenmiş yazı');
    // Trim
    return t.trim();
  }

  const cleaned_prompt_tr_islam = temizleForTurkIslam(text) + "\n\n(Üslup: sade, öğüt verir gibi, Türk‐İslam kültürüne uygun vurgu: niyet, emek, tevekkül)";

  // Kültürel versiyonlar — basit örnekler; gerektiğinde zenginleştir
  const cultural_versions = {
    "turk-islam": cleaned_prompt_tr_islam,
    "japanese": cleaned_prompt_tr_islam
      .replace(/Türk‐İslam|Türk-İslam/gi, 'Japon')
      .replace(/niyet, emek, tevekkül/gi, 'özdisiplin, sadelik, küçük sürekli iyileşme (kaizen)')
      + "\n\n(Üslup: sakin, saygılı, ölçülü)",
    "latin-america": cleaned_prompt_tr_islam
      .replace(/Türk‐İslam|Türk-İslam/gi, 'Latin Amerika')
      .replace(/niyet, emek, tevekkül/gi, 'aile, topluluk, yaşam sevinci')
      + "\n\n(Üslup: sıcak, samimi, motive edici)",
    "african-traditional": cleaned_prompt_tr_islam
      .replace(/Türk‐İslam|Türk-İslam/gi, 'Afrika yerel bilgelikleri')
      .replace(/niyet, emek, tevekkül/gi, 'atalar bilgeliği, topluluk yararı')
      + "\n\n(Üslup: hikâye anlatır gibi, atasözleri kullanarak)",
    "western-academic": text
      .replace(/\bTürk‐İslam|Türk-İslam\b/gi, 'Western academic')
      .concat("\n\n(Üslup: yapılandırılmış; Giriş, Kuramsal Çerçeve, Uygulamalar, Sonuç)"),
    "global-neutral": cleaned_prompt_tr_islam
      .replace(/Türk‐İslam|Türk-İslam/gi, 'farklı kültürlere saygılı genel')
      + "\n\n(Üslup: sade, çoğulcu ve uyarlanabilir)"
  };

  // Sonuç obje
  const result = {
    risks,
    cleaned_prompt_tr_islam,
    cultural_versions
  };

  res.status(200).json(result);
}
