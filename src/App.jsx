import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// CHECKR REAL ESTATE — Production Build
// ═══════════════════════════════════════════════════════════════

// Icons
const Ic=({d,s=16,c="currentColor"})=>(
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const P={
  back:"M15 18l-6-6 6-6",
  fwd:"M9 18l6-6-6-6",
  zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8",
  save:"M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  folder:"M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  trash:"M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  refresh:"M23 4v6h-6M1 20v-6h6M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  down:"M6 9l6 6 6-6",
  up:"M18 15l-6-6-6 6",
};

// Type icons
const TIcon=({t})=>{
  const a={width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"};
  if(t==="etw-alt")return <svg {...a}><path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18z"/><path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>;
  if(t==="etw-neu")return <svg {...a}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>;
  if(t==="efh")return <svg {...a}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>;
  if(t==="reihen")return <svg {...a}><path d="M1 22V11l5-4 5 4v11M13 22V11l5-4 5 4v11"/><path d="M1 22h22"/></svg>;
  if(t==="mfh")return <svg {...a}><path d="M2 22h20M6 22V6l6-4v20M18 22V10l-6-4"/><path d="M10 10h4M10 14h4M10 18h4"/></svg>;
  return null;
};

// ─── Data ────────────────────────────────────────────────────
const TYPES=[
{id:"etw-alt",label:"Eigentumswohnung",sub:"Altbau vor 1980",desc:"Charme & hohe Decken — aber Asbest, alte Leitungen und Feuchtigkeit.",extra:[
{id:"x1",phase:"besichtigung",text:"Wurde das Gebäude auf Asbest geprüft — kein Verdacht?",sev:2,cost:[8000,25000],tip:"Vinyl- und PVC-Böden, Eternit-Platten und bestimmte Putze vor 1990 enthalten häufig Asbest. Nie brechen oder schleifen. In der Schweiz empfiehlt das SUVA eine Analyse vor jeglichen Eingriffen. Die Entsorgung muss durch zertifizierte Fachfirmen erfolgen und ist kostspielig."},
{id:"x2",phase:"besichtigung",text:"Sind die Wasserleitungen frei von Bleirohren?",sev:2,cost:[10000,30000],tip:"Bleirohre sind gesundheitsschädlich. Erkennbar am weichen, grauen Metall. Prüfe sichtbare Leitungen im Keller und unter Spülbecken. Ein kompletter Austausch aller Wasserleitungen ist zwingend nötig und kostspielig."},
{id:"x3",phase:"besichtigung",text:"Ist die Elektroinstallation mit Erdung und FI-Schutzschalter ausgestattet?",sev:2,cost:[12000,35000],tip:"Ohne FI besteht akute Brandgefahr. Eine Kompletterneuerung der Elektroinstallation ist aufwändig und teuer. Prüfe auch ob Leitungsquerschnitte für moderne Geräte ausreichen."},
{id:"x4",phase:"besichtigung",text:"Sind die Holzbalkendecken in gutem Zustand — kein Durchhängen, kein morsches Holz?",sev:2,cost:[20000,80000],tip:"Auf Durchhängen, starkes Knarzen und Bohrmehl (Holzwurm) achten. Morsche Stellen bei Bad/Küche deuten auf Feuchtigkeitsschäden. Sanierung extrem aufwändig."},
{id:"x5",phase:"besichtigung",text:"Ist eine intakte Fassadendämmung vorhanden?",sev:1,cost:[15000,50000],tip:"Altbauten vor 1980 haben oft keine Aussendämmung. WDVS prüfen auf Algenbefall, Risse, Spechtschäden. Ohne Dämmung = hohe Heizkosten."},
{id:"x6",phase:"dokumente",text:"Hast du die STWE-Protokolle geprüft — keine Sonderumlagen geplant?",sev:2,cost:[20000,80000],tip:"Protokolle der letzten 3–5 Jahre zeigen geplante Sanierungen, Streitigkeiten und Sonderumlagen. VOR dem Kaufentscheid einfordern."},
{id:"x7",phase:"dokumente",text:"Ist der Erneuerungsfonds ausreichend geäufnet?",sev:2,cost:[10000,60000],tip:"Die jährliche Einlage pro Quadratmeter muss ausreichend sein. Liegt sie deutlich unter dem Richtwert, drohen erhebliche Sonderumlagen. Kontoauszug verlangen."},
{id:"x8",phase:"dokumente",text:"Hast du das STWE-Reglement vollständig gelesen?",sev:1,cost:[0,0],tip:"Regelt Haustiere, Musikinstrumente, Umbauten, Balkongestaltung. Komplett durchlesen vor dem Kauf."},
]},
{id:"etw-neu",label:"Eigentumswohnung",sub:"Neubau ab 2015",desc:"Modern & effizient — Baumängel, Garantien und Schallschutz prüfen.",extra:[
{id:"x10",phase:"besichtigung",text:"Hast du die Garantie-Restlaufzeit und die Mängelliste geprüft?",sev:2,cost:[0,0],tip:"SIA-Norm 118: 5 Jahre Garantie ab Abnahme. Mängelliste einfordern und prüfen ob alles behoben wurde."},
{id:"x11",phase:"besichtigung",text:"Ist die Lüftungsanlage in gutem Zustand und regelmässig gewartet?",sev:1,cost:[500,3000],tip:"Minergie braucht regelmässige Filterwechsel. Verschmutzte Filter begünstigen Schimmel. Die jährlichen Wartungskosten sind überschaubar aber zwingend."},
{id:"x12",phase:"besichtigung",text:"Ist der Schallschutz ausreichend — kein störender Trittschall oder Technik-Lärm?",sev:1,cost:[0,0],tip:"Teste wenn Nachbarn da sind. Schlechter Schallschutz ist nachträglich kaum behebbar."},
{id:"x13",phase:"besichtigung",text:"Sind die Fliesen fest verlegt — keine Hohlstellen beim Klopftest?",sev:1,cost:[3000,12000],tip:"Hohlklingende Fliesen = nicht vollflächig verklebt. Bruchgefahr. Die Nachrüstung ist aufwändig und teuer."},
{id:"x14",phase:"besichtigung",text:"Ist die Wärmepumpe leise und effizient?",sev:1,cost:[0,0],tip:"Luft-WP bei tiefen Temperaturen laut. Position relativ zu Schlafräumen prüfen. COP über 3.5."},
{id:"x15",phase:"dokumente",text:"Ist die Tiefgarage in gutem Zustand — keine Risse, Entwässerung funktioniert?",sev:1,cost:[20000,100000],tip:"Tiefgaragen-Sanierung extrem teuer. Beschichtung, Rinnen und Feuchtigkeitsflecken prüfen."},
{id:"x16",phase:"dokumente",text:"Stimmen die budgetierten Betriebskosten mit der Abrechnung überein?",sev:1,cost:[0,0],tip:"Erste Abrechnungen bei Neubauten oft höher als erwartet. Budgetannahmen mit realen Zahlen vergleichen."},
{id:"x17",phase:"dokumente",text:"Funktionieren alle Fenster und Türen einwandfrei?",sev:0,cost:[200,2000],tip:"Bei Neubauten häufig falsch eingestellt. Meist kleiner Justierungsaufwand."},
]},
{id:"efh",label:"Einfamilienhaus",sub:"Alle Baujahre",desc:"Von Dach bis Keller, Garten bis Garage — das volle Programm.",extra:[
{id:"x20",phase:"besichtigung",text:"Ist das Dach in gutem Zustand — keine verrutschten Ziegel, kein Moosbefall?",sev:2,cost:[30000,80000],tip:"Lebensdauer 40–60 Jahre. Moosbefall = hohe Feuchtigkeit. Eine Dachsanierung gehört zu den teuersten Massnahmen."},
{id:"x21",phase:"besichtigung",text:"Ist der Dachstuhl von innen trocken und frei von Schädlingsbefall?",sev:2,cost:[15000,50000],tip:"Im Dachboden auf dunkle Flecken, modrigen Geruch und Bohrmehl achten."},
{id:"x22",phase:"besichtigung",text:"Ist der Keller trocken, rissfrei und die Drainage intakt?",sev:2,cost:[15000,60000],tip:"Alle Kellerräume prüfen: Geruch, Wasserränder, Salzausblühungen. Die nachträgliche Abdichtung von aussen ist aufwändig und teuer."},
{id:"x23",phase:"besichtigung",text:"Ist die Fassade rissfrei und der Sockel trocken?",sev:1,cost:[10000,50000],tip:"Risse >2mm = Setzungsschäden. Abblätternder Putz unten = fehlende Horizontalsperre."},
{id:"x24",phase:"besichtigung",text:"Ist der Garten unproblematisch — keine Bäume zu nah am Haus, Entwässerung intakt?",sev:1,cost:[3000,15000],tip:"Wurzeln können Fundamente beschädigen. Bei Hanglagen Entwässerung und Stützmauern prüfen."},
{id:"x25",phase:"dokumente",text:"Hast du den Zonenplan und die Ausnützungsziffer geprüft?",sev:1,cost:[0,0],tip:"Bestimmt ob An-/Aufbauten möglich. Auch Nachbars Verdichtungspotenzial beachten!"},
{id:"x26",phase:"dokumente",text:"Hast du die Naturgefahrenkarte geprüft — kein Risikogebiet?",sev:2,cost:[0,0],tip:"Beim Kanton öffentlich einsehbar. Gefährdung = teurere Versicherung oder unversicherbar."},
{id:"x27",phase:"dokumente",text:"Ist die Gebäudeversicherung inkl. Elementarschäden ausreichend?",sev:1,cost:[0,0],tip:"Deckungssumme muss Neuwert entsprechen. Unterversicherung im Schadensfall ruinös."},
]},
{id:"reihen",label:"Reihenhaus",sub:"Mittel- & Eckhaus",desc:"Geteilte Wände — Schallschutz und Reglement entscheidend.",extra:[
{id:"x30",phase:"besichtigung",text:"Ist der Schallschutz zur Nachbarwand ausreichend?",sev:2,cost:[0,0],tip:"Klopfe an die Wand. Nachrüstung fast unmöglich. Teste wenn Nachbarn da sind."},
{id:"x31",phase:"besichtigung",text:"Sind die Übergänge und Dehnfugen zum Nachbarhaus rissfrei?",sev:1,cost:[2000,10000],tip:"Unterschiedliche Setzungen verursachen Risse. Dehnfugen innen und aussen prüfen."},
{id:"x32",phase:"besichtigung",text:"Ist der Keller ausreichend belüftet und trocken?",sev:1,cost:[5000,20000],tip:"Eingeschränkte Belüftung im Keller — Feuchtigkeit und Schimmel häufig."},
{id:"x33",phase:"besichtigung",text:"Ist die Verantwortung für Dach und Fassade klar geregelt?",sev:1,cost:[0,0],tip:"Wer zahlt bei Sanierung? Zustimmung des Nachbarn nötig? Reglement prüfen."},
{id:"x34",phase:"besichtigung",text:"Gehört der Parkplatz klar zum Eigentum?",sev:1,cost:[0,0],tip:"Zufahrt über Nachbars Grundstück? Grundbuchauszug auf Wegrechte prüfen."},
{id:"x35",phase:"dokumente",text:"Hast du das Miteigentums-Reglement vollständig gelesen?",sev:2,cost:[0,0],tip:"Haustiere, Grillverbote, Fassadenfarbe — alles geregelt und bindend. VOR Kauf lesen."},
{id:"x36",phase:"dokumente",text:"Ist die Kostenverteilung der Gemeinschafts-Heizung klar geregelt?",sev:1,cost:[0,0],tip:"Wer entscheidet über Ersatz? Kostenverteilung nach Fläche oder Verbrauch?"},
{id:"x37",phase:"dokumente",text:"Sind die Grundstücksgrenzen aktuell vermessen und klar definiert?",sev:1,cost:[0,0],tip:"Bei Reihenhäusern häufig Streit über Grenzen. Grundbuchplan prüfen."},
]},
{id:"mfh",label:"Mehrfamilienhaus",sub:"Renditeobjekt",desc:"Mieterträge, Zustand und CAPEX-Planung prüfen.",extra:[
{id:"x40",phase:"inserat",text:"Basiert die angegebene Rendite auf tatsächlichen Ist-Mieten?",sev:2,cost:[0,0],tip:"Inserierte Rendite basiert oft auf Soll-Miete. Rechne selbst mit Ist-Mieten und 3–5% Leerstand."},
{id:"x41",phase:"besichtigung",text:"Sind die Allgemeinbereiche in gutem Zustand?",sev:1,cost:[10000,50000],tip:"Zeigt Unterhaltszustand. Abgenutzte Bereiche = Investitionsrückstau."},
{id:"x42",phase:"besichtigung",text:"Sind Flachdach, Fassade und Tiefgarage in gutem Zustand?",sev:2,cost:[50000,200000],tip:"Die drei grössten CAPEX-Posten. Jeder dieser Posten kann sechsstellige Kosten verursachen."},
{id:"x43",phase:"besichtigung",text:"Sind Heizung und Elektrik in zeitgemässem Zustand?",sev:2,cost:[30000,80000],tip:"Ölheizungen haben begrenzte Restlaufzeit. Energiekosten/Jahr erfragen."},
{id:"x44",phase:"dokumente",text:"Hast du eine vollständige Mieterliste mit Mietzinsen erhalten?",sev:2,cost:[0,0],tip:"Langzeit-Mieter = stabil aber evtl. unter Markt. Offene Forderungen prüfen."},
{id:"x45",phase:"dokumente",text:"Ist ein CAPEX- oder Sanierungsplan vorhanden?",sev:2,cost:[0,0],tip:"Ohne = blind kaufen. 10-Jahres-Plan anfordern."},
{id:"x46",phase:"dokumente",text:"Hast du alle Mietverträge auf Sondervereinbarungen geprüft?",sev:1,cost:[0,0],tip:"Sondervereinbarungen können Ertrag beeinflussen."},
{id:"x47",phase:"dokumente",text:"Ist die Gebäudeversicherung ausreichend?",sev:1,cost:[0,0],tip:"Muss Neuwert entsprechen. Bei MFH schnell sechsstellig."},
]},
];

const PHASES=[
{id:"inserat",label:"Inserat-Check",sub:"Vor der Besichtigung",intro:"Prüfe das Inserat bevor du einen Termin vereinbarst. Viele Probleme erkennst du bereits hier.",flags:[
{id:"i1",text:"Sind Grundriss, Wohnfläche und Zimmerzahl angegeben?",sev:1,tip:"Fehlende Flächenangaben sind ein Warnsignal. Grundriss vor der Besichtigung einfordern."},
{id:"i2",text:"Ist das Baujahr klar angegeben?",sev:2,tip:"Vor 1960: Bleirohre. Vor 1980: Asbest. Vor 2000: oft Einfachverglasung, überalterte Heizungen."},
{id:"i3",text:"Sind Renovierungsstand und Investitionen beschrieben?",sev:1,tip:"«Liebevoll gepflegt» = oft seit 20+ Jahren nicht investiert. Konkrete Jahreszahlen verlangen."},
{id:"i4",text:"Sind Heizungstyp und Energieeffizienz angegeben?",sev:1,tip:"Fehlende Angaben deuten oft auf eine veraltete Öl- oder Gasheizung hin. Der Ersatz durch eine Wärmepumpe ist eine der teuersten Sanierungsmassnahmen. Prüfe ob ein Energieausweis vorhanden ist."},
{id:"i5",text:"Ist der Preis pro m² marktüblich?",sev:1,tip:"Auf Homegate/ImmoScout vergleichen. Deutlich tieferer Preis = versteckte Mängel möglich."},
{id:"i6",text:"Sind Verkaufsgrund und Insertionsdauer erkennbar?",sev:1,tip:"Über 6 Monate inseriert = entweder Preis falsch oder Problem vorhanden."},
{id:"i7",text:"Professionelle Fotos — und was zeigen sie nicht?",sev:0,tip:"Achte auf was NICHT gezeigt wird: Keller, Treppenhaus, Blick aus dem Fenster, Umgebung."},
]},
{id:"kontakt",label:"Makler & Kontakt",sub:"Vor dem Termin klären",intro:"Wie der Makler auf Fragen reagiert, sagt oft mehr als die Antworten selbst.",flags:[
{id:"k1",text:"Werden technische Fragen offen beantwortet?",sev:2,tip:"Frage nach Baujahr, Heizungsalter, Renovierungen. Ausweichende Antworten sind ein Warnsignal."},
{id:"k2",text:"Lässt dir der Makler ausreichend Bedenkzeit?",sev:1,tip:"Wenn Druck aufgebaut wird — «mehrere Interessenten», «geht schnell weg» — ist das ein Warnsignal. Seriöse Makler geben dir die nötige Zeit für eine fundierte Entscheidung."},
{id:"k3",text:"Sind alle Unterlagen vorab verfügbar?",sev:1,tip:"Grundriss, Grundbuchauszug, Energieausweis, Nebenkostenabrechnung, STWE-Protokolle vorab anfordern."},
{id:"k4",text:"Ist die Maklerprovision transparent geregelt?",sev:1,tip:"Wer zahlt die Maklerprovision? In CH Verhandlungssache, in DE seit 2020 geteilt."},
{id:"k5",text:"Zweite Besichtigung mit Gutachter willkommen?",sev:2,tip:"Wird ein Sachverständiger abgelehnt, ist das ein ernstes Warnsignal."},
{id:"k6",text:"Besichtigung zu verschiedenen Tageszeiten möglich?",sev:0,tip:"Tagsüber UND abends/Wochenende — für die wahre Lärmbelastung und Nachbarschaft."},
]},
{id:"besichtigung",label:"Besichtigung",sub:"Vor Ort prüfen",intro:"Mindestens 45 Minuten einplanen. Von aussen nach innen, oben nach unten. Nicht hetzen lassen.",flags:[
{id:"b1",text:"Ist die Fassade in gutem Zustand — ohne Risse, Putzschäden oder Feuchtigkeit?",sev:2,cost:[5000,40000],tip:"Risse über 2mm können auf Setzungsschäden hinweisen. Verfärbungen und abblätternder Putz im Sockelbereich deuten auf aufsteigende Feuchtigkeit hin. Lasse grössere Risse von einem Fachmann beurteilen."},
{id:"b2",text:"Ist der Keller trocken und geruchsfrei?",sev:2,cost:[15000,60000],tip:"Der Keller ist die ehrlichste Zone im Haus. Achte auf muffigen Geruch (auch wenn gelüftet wurde), Salzausblühungen an den Wänden und feuchte Ecken. Feuchtigkeit im Keller kann auf fehlende Drainage oder eindringendes Grundwasser hindeuten. Die Sanierung ist aufwändig und teuer."},
{id:"b3",text:"Sind die Fenster in gutem Zustand — Doppel-/Dreifachverglasung, dichte Rahmen?",sev:1,cost:[15000,45000],tip:"Kondenswasser zwischen den Scheiben bedeutet defekte Isolierverglasung — die Fenster müssen komplett ersetzt werden. Prüfe auch die Dichtungen und das Alter. Fenster über 25 Jahre stehen meist bald zum Austausch an."},
{id:"b4",text:"Ist die Heizung jünger als 20 Jahre und regelmässig gewartet?",sev:1,cost:[25000,65000],tip:"Heizungen über 20 Jahre stehen kurz vor dem Ersatz. Frage nach dem letzten Service-Datum und den jährlichen Energiekosten. In vielen Regionen gelten bereits Austauschpflichten für fossile Heizungen."},
{id:"b5",text:"Sind Wände und Decken frei von Wasserflecken, Rissen und Durchhängen?",sev:2,cost:[2000,30000],tip:"Wasserflecken an der Decke deuten auf ein undichtes Dach oder einen Leitungsschaden hin. Durchhängende Decken bei Holzbalken sind ein Alarmzeichen für Fäulnis oder Überlastung. Risse können kosmetisch oder strukturell sein — im Zweifelsfall Fachmann beiziehen."},
{id:"b6",text:"Sind Bad und Küche in gutem Zustand — saubere Fugen, kein Schimmel?",sev:1,cost:[3000,25000],tip:"Schwarze Fugen in Dusche und Bad bedeuten Schimmelbefall. Teste auch den Wasserdruck und die Warmwasser-Aufbereitung. Sichtbarer Schimmel ist oft nur die Oberfläche eines tieferliegenden Feuchtigkeitsproblems."},
{id:"b7",text:"Ist die Elektroinstallation zeitgemäss — mit FI-Schutzschalter?",sev:1,cost:[12000,35000],tip:"Öffne den Sicherungskasten: Ist ein FI-Schutzschalter vorhanden? Sind die Sicherungen beschriftet? Prüfe auch ob der Leitungsquerschnitt für moderne Geräte wie Induktionsherd oder E-Auto-Laden ausreicht."},
{id:"b8",text:"Ist die Umgebung ruhig und die Infrastruktur gut?",sev:1,cost:[0,0],tip:"Gehe vor und nach der Besichtigung durch die Umgebung. Achte auf Verkehrslärm, Gerüche und die ÖV-Anbindung. Komme ein zweites Mal zu einer anderen Tageszeit — abends und am Wochenende zeigt sich die wahre Lärmbelastung."},
{id:"b9",text:"Funktionieren Türen, Böden und Treppen einwandfrei?",sev:0,cost:[2000,15000],tip:"Klemmende Türen können auf Setzungen im Gebäude hindeuten. Prüfe Böden auf Unebenheiten und lose Stellen. Bei Treppen auf Stabilität und fehlende Handläufe achten."},
]},
{id:"dokumente",label:"Dokumente & Finanzen",sub:"Papiere prüfen",intro:"Was nicht dokumentiert ist, existiert nicht. Was hier übersehen wird, wird teuer.",flags:[
{id:"d1",text:"Hast du den Grundbuchauszug geprüft — keine problematischen Einträge?",sev:2,tip:"Das wichtigste Dokument. Wegrechte, Baurechte, Pfandrechte prüfen."},
{id:"d2",text:"Ist ein aktueller Energieausweis vorhanden?",sev:1,tip:"GEAK (CH) / Energieausweis (DE). A/B = gut, D+ = Sanierungsbedarf."},
{id:"d3",text:"Sind alle Baupläne und Bewilligungen vorhanden?",sev:1,tip:"Umbauten ohne Bewilligung = Rückbau auf eigene Kosten möglich."},
{id:"d4",text:"Hast du die Nebenkostenabrechnung der letzten 2–3 Jahre eingesehen?",sev:1,tip:"Realistisches Bild der laufenden Kosten. Mit Inserat-Angaben vergleichen."},
{id:"d5",text:"Hast du mehrere Hypothekar-Offerten eingeholt und verglichen?",sev:2,tip:"Hole mindestens 3 Offerten ein — von verschiedenen Anbietern. Die Zinsunterschiede können über die Laufzeit erheblich sein. Die Tragbarkeitsrechnung sollte auf einem kalkulatorischen Zins basieren, nicht auf dem aktuellen Marktzins."},
{id:"d6",text:"Hast du alle Kaufnebenkosten kalkuliert?",sev:1,tip:"Neben dem Kaufpreis fallen Handänderungssteuer, Grundbuchgebühren, Notariatskosten und ggf. Maklercourtage an. Rechne insgesamt mit 3–5% des Kaufpreises als zusätzliche Nebenkosten."},
{id:"d7",text:"Hast du den Altlasten-Kataster geprüft?",sev:1,tip:"Öffentlich einsehbar. Belasteter Boden = Sanierungskosten fallen dem Eigentümer zu."},
]},
{id:"vertrag",label:"Kaufvertrag",sub:"Die letzte Hürde",intro:"Der Kaufvertrag bindet dich für Jahrzehnte. Nichts unter Druck unterschreiben.",flags:[
{id:"v1",text:"Wurde der Kaufvertrag von einem unabhängigen Anwalt geprüft?",sev:2,tip:"Unterschreibe keinen Kaufvertrag ohne unabhängige Prüfung. Der Notar beurkundet, berät aber nicht einseitig. Engagiere einen eigenen Immobilien-Anwalt der den Vertrag auf Fallstricke prüft — das ist eine der besten Investitionen im ganzen Kaufprozess."},
{id:"v2",text:"Ist der Zustand der Immobilie im Vertrag detailliert beschrieben?",sev:2,tip:"Je mehr Details im Vertrag, desto weniger Streit danach. Fotos als Anhang empfehlenswert."},
{id:"v3",text:"Ist die Gewährleistung im Vertrag klar geregelt?",sev:2,tip:"«Wie gesehen» = keine Gewährleistung. Bei Neubau: 5 Jahre SIA-Norm."},
{id:"v4",text:"Sind Zahlungs- und Übergabemodalitäten klar festgelegt?",sev:1,tip:"Wann Kaufpreis fällig? Wann Schlüsselübergabe? Aufschiebende Bedingungen fixieren."},
{id:"v5",text:"Ist die Finanzierung definitiv und verbindlich zugesagt?",sev:2,tip:"Vorbescheid ≠ definitive Zusage. Ohne verbindliche Hypothek nie unterschreiben."},
{id:"v6",text:"Ist die Kostenverteilung klar geregelt — Notar, Steuern, Makler?",sev:1,tip:"Alle Nebenkosten vertraglich zuordnen. Ohne klare Regelung gibt es Streit."},
]},
];

const fmtCHF=n=>n>0?`${Math.round(n).toLocaleString("de-CH")}`:"—";

// ─── Stylesheet ──────────────────────────────────────────────
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700;1,800&display=swap');
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{background:#0A0A0C;color:#EDEAE2;font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
button{font-family:'DM Sans',sans-serif;cursor:pointer;-webkit-appearance:none}
input{font-family:'DM Sans',sans-serif;-webkit-appearance:none}
.safe{height:max(env(safe-area-inset-top),44px);background:#0A0A0C;flex-shrink:0}
.app{display:flex;flex-direction:column;min-height:100dvh;max-width:100vw;overflow-x:hidden;background:#0A0A0C}
.scr{flex:1;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:4px 16px 10px;background:#0A0A0C;flex-shrink:0;border-bottom:1px solid #222228}
`;

// ─── Component ───────────────────────────────────────────────
export default function App(){
  const[scr,set]=useState("home");
  const[typ,setTyp]=useState(null);
  const[pi,setPi]=useState(0);
  const[pop,setPop]=useState(false);
  const[ans,setAns]=useState({});
  const[tips,setT]=useState({});
  const[saved,setSaved]=useState([]);
  const[nm,setNm]=useState("");
  const[vid,setVid]=useState(null);
  const[editNm,setEditNm]=useState(null);
  const ref=useRef(null);
  useEffect(()=>{ref.current?.scrollTo(0,0)},[scr,pi,vid]);

  // Colors
  const C={bg:"#0A0A0C",s1:"#111114",s2:"#18181C",s3:"#1F1F24",ln:"#222228",ln2:"#2C2C33",ink:"#EDEAE2",ink2:"#9A958C",ink3:"#5A5650",ink4:"#3A3835",lime:"#C8F55A",lime1:"rgba(200,245,90,.08)",lime2:"rgba(200,245,90,.15)",ok:"#5AF5A0",ok1:"rgba(90,245,160,.08)",ok2:"rgba(90,245,160,.15)",wrn:"#F5A623",wrn1:"rgba(245,166,35,.08)",wrn2:"rgba(245,166,35,.15)",err:"#F55A5A",err1:"rgba(245,90,90,.06)",err2:"rgba(245,90,90,.15)"};
  const F={d:"'Syne',sans-serif",b:"'DM Sans',sans-serif",m:"'DM Mono',monospace",p:"'Playfair Display',Georgia,serif"};

  // Build phases
  const phases=typ?PHASES.map(p=>{const e=TYPES.find(t=>t.id===typ)?.extra.filter(x=>x.phase===p.id)||[];return e.length?{...p,extra:e}:p;}):PHASES;
  const ph=phases[pi];
  const af=p=>[...p.flags,...(p.extra||[])];
  const ac=p=>af(p).filter(f=>ans[f.id]).length;
  const all=phases.flatMap(af);
  const nos=all.filter(f=>ans[f.id]==="no");
  const yC=all.filter(f=>ans[f.id]==="yes").length;
  const sC=all.filter(f=>ans[f.id]==="skip").length;
  const cN=nos.filter(f=>f.sev===2).length;
  const vd=cN>=3?"stop":cN>=1||nos.length>=4?"caution":"go";
  const cL=nos.reduce((s,f)=>s+(f.cost?.[0]||0),0);
  const cH=nos.reduce((s,f)=>s+(f.cost?.[1]||0),0);

  const da=(id,v)=>setAns(p=>({...p,[id]:p[id]===v?undefined:v}));
  const dt=id=>setT(p=>({...p,[id]:!p[id]}));
  const go=s=>set(s);
  const pick=id=>{setTyp(id);setAns({});setT({});setPi(0);setNm("");setPop(true);go("phase");};
  const next=()=>{if(pi<phases.length-1){setPi(pi+1);setPop(true);}else go("summary");};
  const save=()=>{
    if(!nm.trim())return;const t=TYPES.find(x=>x.id===typ);
    setSaved(p=>[{id:Date.now(),nm:nm.trim(),type:t?.label||"",sub:t?.sub||"",tId:typ,date:new Date().toLocaleDateString("de-CH"),yes:yC,no:nos.length,skip:sC,vd,cL,cH,answers:{...ans},details:nos.map(f=>({text:f.text,tip:f.tip,sev:f.sev,cost:f.cost,phase:phases.find(p2=>af(p2).some(x=>x.id===f.id))?.label||""}))},...p]);
    go("home");setTyp(null);setAns({});setT({});setNm("");
  };
  const tn=TYPES.find(t=>t.id===typ);

  // Rename saved inspection
  const renameSaved=(id,newName)=>{
    if(!newName.trim())return;
    setSaved(p=>p.map(s=>s.id===id?{...s,nm:newName.trim()}:s));
    setEditNm(null);
  };

  // Resume / edit a saved inspection
  const resumeCheck=(s)=>{
    setTyp(s.tId);
    setAns(s.answers||{});
    setT({});
    setPi(0);
    setNm(s.nm);
    setPop(false);
    setVid(null);
    go("phase");
  };

  // Update saved after editing
  const updateSaved=(oldId)=>{
    const t=TYPES.find(x=>x.id===typ);
    setSaved(p=>p.map(s=>s.id===oldId?{...s,nm:nm.trim()||s.nm,yes:yC,no:nos.length,skip:sC,vd,cL,cH,answers:{...ans},details:nos.map(f=>({text:f.text,tip:f.tip,sev:f.sev,cost:f.cost,phase:phases.find(p2=>af(p2).some(x=>x.id===f.id))?.label||""}))}:s));
    go("home");setTyp(null);setAns({});setT({});setNm("");
  };

  // ─── Shared styles ─────────────────────────────────────────
  const bx={width:"100%",maxWidth:"100%",overflowX:"hidden",boxSizing:"border-box"};
  const btn=(bg,color,extra={})=>({width:"100%",padding:"14px 16px",background:bg,color,fontFamily:F.b,fontSize:15,fontWeight:700,border:"none",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",gap:6,...extra});

  // ─── Flag Card ─────────────────────────────────────────────
  const Flag=({f,n})=>{
    const a=ans[f.id],t=tips[f.id];
    const sc=f.sev===2?C.err:f.sev===1?C.wrn:C.ink3;
    const bg=a==="no"?C.err1:a==="yes"?C.ok1:C.s1;
    const bd=a==="no"?C.err2:a==="yes"?C.ok2:C.ln;
    return(
      <div style={{margin:"8px 12px",borderRadius:12,background:bg,border:`1px solid ${bd}`,...bx}}>
        <div style={{padding:"16px 16px 14px"}}>
          <div style={{fontSize:15,lineHeight:1.55,fontWeight:500,marginBottom:14,fontFamily:F.b}}>
            <span style={{fontFamily:F.m,fontSize:12,fontWeight:700,color:C.ink3,marginRight:8}}>{n}</span>{f.text}
          </div>

          <div style={{display:"flex",gap:8}}>
            {[["yes","Ja",C.ok,C.ok1],["no","Nein",C.err,C.err1]].map(([v,l,ac2,ab])=>(
              <button key={v} onClick={()=>da(f.id,v)} style={{
                flex:1,padding:"12px 4px",borderRadius:10,fontSize:14,fontWeight:600,
                fontFamily:F.b,textAlign:"center",border:"none",
                background:a===v?ab:C.s2,color:a===v?ac2:C.ink2,
                display:"flex",alignItems:"center",justifyContent:"center",gap:3,
              }}>{v==="yes"?"✓":v==="no"?"✗":"–"} {l}</button>
            ))}
          </div>
          {a==="no"&&(
            <div style={{marginTop:12,padding:"14px",background:"rgba(245,90,90,.04)",borderRadius:10,borderLeft:`3px solid ${C.err}`,fontSize:13,fontFamily:F.b,color:C.ink2,lineHeight:1.7}}>
              <div style={{fontFamily:F.m,fontSize:9,color:C.err,letterSpacing:1,marginBottom:6,textTransform:"uppercase"}}>Achtung</div>
              {f.tip}
              {f.cost&&f.cost[1]>0&&<div style={{marginTop:8,padding:"7px 10px",background:C.wrn1,borderRadius:6,fontFamily:F.m,fontSize:11,color:C.wrn}}>Geschätzte Kosten: {fmtCHF(f.cost[0])} – {fmtCHF(f.cost[1])}</div>}
            </div>
          )}
          {a!=="no"&&(
            <button onClick={()=>dt(f.id)} style={{display:"flex",alignItems:"center",gap:5,marginTop:12,padding:"10px 12px",background:C.s2,borderRadius:8,fontSize:12,fontFamily:F.b,color:C.ink3,border:"none",width:"100%",textAlign:"left"}}>
              <Ic d={t?P.up:P.down} s={14} c={C.ink3}/> {t?"Tipp ausblenden":"Tipp anzeigen"}
            </button>
          )}
          {a!=="no"&&t&&(
            <div style={{marginTop:8,padding:14,background:C.s2,borderRadius:10,borderLeft:`3px solid ${C.ink3}`,fontSize:13,fontFamily:F.b,color:C.ink2,lineHeight:1.7}}>{f.tip}</div>
          )}
        </div>
      </div>
    );
  };

  // ─── Render ────────────────────────────────────────────────
  return(<>
    <style>{CSS}</style>
    <div className="app">
      <div className="safe"/>

      {scr!=="home"&&(
        <div className="hdr">
          <button onClick={()=>{if(vid){setVid(null);return;}if(scr==="summary")go("phase");else if(scr==="saved"||scr==="select")go("home");else if(pi>0)setPi(pi-1);else go("select");}}
            style={{display:"flex",alignItems:"center",gap:3,color:C.ink2,fontSize:14,background:"none",border:"none",fontFamily:F.b,padding:"8px 4px 8px 0"}}>
            <Ic d={P.back}/> Zurück
          </button>
          <span style={{fontFamily:F.m,fontSize:10,color:C.ink3}}>{scr==="phase"?`Phase ${pi+1} von ${phases.length}`:scr==="select"?"Typ wählen":""}</span>
        </div>
      )}

      <div className="scr" ref={ref}>

      {/* ══ HOME ══ */}
      {scr==="home"&&(<div style={{padding:"8px 20px 0",...bx}}>
        <div style={{display:"inline-flex",alignItems:"center",background:C.lime1,border:`1px solid ${C.lime2}`,padding:"6px 14px",borderRadius:100,marginBottom:22}}>
          <span style={{width:7,height:7,borderRadius:"50%",background:C.lime,marginRight:10}}/>
          <span style={{fontFamily:F.m,fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"rgba(200,245,90,.65)"}}>CHECKR</span>
          <span style={{margin:"0 8px",color:"rgba(200,245,90,.2)"}}>|</span>
          <span style={{fontFamily:F.m,fontSize:10,letterSpacing:2,textTransform:"uppercase",color:C.lime,fontWeight:700}}>REAL ESTATE</span>
        </div>
        <h1 style={{fontFamily:F.p,fontSize:36,fontWeight:800,lineHeight:1.06,letterSpacing:"-.5px"}}>Immobilie kaufen.</h1>
        <h1 style={{fontFamily:F.p,fontSize:36,fontWeight:800,lineHeight:1.06,letterSpacing:"-.5px",color:C.lime,fontStyle:"italic",marginTop:4}}>Ohne böse Überraschungen.</h1>
        <p style={{fontSize:14,color:C.ink2,lineHeight:1.65,marginTop:16}}>CHECKR RE führt dich Schritt für Schritt durch die Besichtigung. Du siehst sofort, worauf es ankommt.</p>

        {saved.length>0&&(
          <div onClick={()=>go("saved")} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",marginTop:16,borderTop:`1px solid ${C.ln}`,cursor:"pointer"}}>
            <span style={{fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:7}}><Ic d={P.folder} s={15} c={C.ink2}/> Meine Immobilien</span>
            <span style={{fontFamily:F.m,fontSize:10,color:C.lime,background:C.lime1,padding:"3px 9px",borderRadius:6}}>{saved.length}</span>
          </div>
        )}

        <div style={{marginTop:20,padding:20,background:C.s1,border:`1px solid ${C.ln}`,borderRadius:14}}>
          <div style={{fontFamily:F.m,fontSize:10,color:C.lime,letterSpacing:2,textTransform:"uppercase",marginBottom:16}}>So funktioniert's</div>
          {["Immobilientyp wählen. Schwachstellen werden automatisch geladen.","Jede Frage mit Ja oder Nein beantworten.","Kostenschätzung und klare Empfehlung am Ende.","Inspektionen speichern und jederzeit wieder öffnen."].map((t,i)=>(
            <div key={i} style={{display:"flex",gap:12,marginBottom:i<3?14:0}}>
              <span style={{fontFamily:F.m,fontSize:12,fontWeight:700,color:C.lime,background:C.lime1,width:24,height:24,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
              <span style={{fontSize:13,color:C.ink2,lineHeight:1.6,paddingTop:2}}>{t}</span>
            </div>
          ))}
        </div>

        <div style={{marginTop:16,padding:"12px 14px",background:C.s2,border:`1px solid ${C.ln}`,borderRadius:10,fontSize:11,color:C.ink3,lineHeight:1.6}}>
          CHECKR RE deckt die häufigsten Bau-Mängel und Risiken ab, kann jedoch keinen vollständigen Schutz garantieren. Die App ersetzt keine professionelle Bau-Begutachtung oder Rechtsberatung. Alle Kostenschätzungen sind indikativ.
        </div>

        <div style={{padding:"20px 0 48px"}}>
          <button onClick={()=>go("select")} style={btn(C.lime,C.bg,{fontSize:15,padding:16,borderRadius:12})}>
            <Ic d={P.zap} s={20} c={C.bg}/> Check starten
          </button>
        </div>
      </div>)}

      {/* ══ SELECT ══ */}
      {scr==="select"&&(<div style={{...bx}}>
        <div style={{padding:"16px 16px 12px"}}>
          <div style={{fontFamily:F.m,fontSize:9,color:C.lime,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Immobilientyp wählen</div>
          <h2 style={{fontFamily:F.b,fontSize:20,fontWeight:700,lineHeight:1.2}}>Um welche Immobilie geht es?</h2>
          <p style={{fontSize:12,color:C.ink2,marginTop:4}}>Schwachstellen des Typs werden automatisch geladen.</p>
        </div>
        <div style={{padding:"0 14px 32px"}}>
          {TYPES.map(t=>(
            <div key={t.id} onClick={()=>pick(t.id)} style={{display:"flex",alignItems:"center",gap:12,padding:14,background:C.s1,border:`1px solid ${C.ln}`,borderRadius:12,marginBottom:8,cursor:"pointer"}}>
              <div style={{width:42,height:42,background:C.s2,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:C.lime}}><TIcon t={t.id}/></div>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:14,fontWeight:600}}>{t.label}</div><div style={{fontFamily:F.m,fontSize:9.5,color:C.ink3,marginTop:1}}>{t.sub}</div><div style={{fontSize:11,color:C.ink2,marginTop:2,lineHeight:1.4}}>{t.desc}</div></div>
              <Ic d={P.fwd} s={14} c={C.ink4}/>
            </div>
          ))}
        </div>
      </div>)}

      {/* ══ PHASE ══ */}
      {scr==="phase"&&(<div style={{...bx}}>
        {pop&&(
          <div onClick={()=>setPop(false)} style={{position:"fixed",inset:0,zIndex:100,display:"flex",alignItems:"flex-end",background:"rgba(0,0,0,.7)",backdropFilter:"blur(4px)"}}>
            <div onClick={e=>e.stopPropagation()} style={{width:"100%",background:C.s1,borderRadius:"16px 16px 0 0",padding:"16px 16px 32px"}}>
              <div style={{width:28,height:3,background:C.ln2,borderRadius:2,margin:"0 auto 14px"}}/>
              <div style={{fontFamily:F.m,fontSize:9,color:C.lime,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Phase {pi+1} von {phases.length}</div>
              <div style={{fontFamily:F.b,fontSize:17,fontWeight:700,marginBottom:4}}>{ph.sub}</div>
              <p style={{fontSize:13,color:C.ink2,lineHeight:1.6,marginBottom:16}}>{ph.intro}</p>
              {ph.extra?.length>0&&<div style={{fontSize:11,color:C.lime,marginBottom:12}}>+ {ph.extra.length} typspezifische Checks für {tn?.sub}</div>}
              <button onClick={()=>setPop(false)} style={btn(C.lime,C.bg,{fontFamily:F.b,fontWeight:700,fontSize:13})}>Verstanden — los geht's</button>
            </div>
          </div>
        )}

        {/* Progress */}
        <div style={{display:"flex",gap:3,padding:"10px 16px",background:C.s1,borderBottom:`1px solid ${C.ln}`}}>
          {phases.map((p,i)=>{
            const done=af(phases[i]).length>0&&af(phases[i]).every(f=>ans[f.id]);
            return(
              <div key={i} onClick={()=>setPi(i)} style={{flex:1,cursor:"pointer",textAlign:"center"}}>
                <div style={{height:3,borderRadius:2,background:done?C.lime:i===pi?C.lime:C.s3,opacity:done?1:i===pi?.5:.15}}/>
                <div style={{fontFamily:F.m,fontSize:9,color:i===pi?C.lime:done?C.ok:C.ink4,marginTop:4}}>{p.label.split(" ")[0]}</div>
              </div>
            );
          })}
        </div>

        {/* Phase header */}
        <div style={{padding:"14px 16px",background:`linear-gradient(180deg,${C.s1},${C.bg})`,borderBottom:`1px solid ${C.ln}`}}>
          <div style={{fontFamily:F.m,fontSize:9,color:C.lime,letterSpacing:1.2,textTransform:"uppercase"}}>Phase {pi+1} · {ph.label}</div>
          <div style={{fontFamily:F.b,fontSize:18,fontWeight:700,marginTop:3}}>{ph.sub}</div>
          <div style={{fontFamily:F.m,fontSize:10,color:C.ink3,marginTop:4}}>{ac(ph)} von {af(ph).length} beantwortet</div>
          <div style={{height:4,background:C.s3,borderRadius:2,marginTop:10,overflow:"hidden"}}>
            <div style={{height:"100%",background:`linear-gradient(90deg,${C.lime},rgba(200,245,90,.5))`,borderRadius:2,transition:"width .4s",width:`${af(ph).length>0?(ac(ph)/af(ph).length)*100:0}%`}}/>
          </div>
        </div>

        {/* Flags */}
        <div style={{paddingTop:4,paddingBottom:8}}>
          {ph.flags.map((f,i)=><Flag key={f.id} f={f} n={i+1}/>)}
          {ph.extra?.length>0&&(<>
            <div style={{padding:"10px 16px",background:C.lime1,borderBottom:`1px solid ${C.ln}`,display:"flex",alignItems:"center",gap:8,fontFamily:F.m,fontSize:9,color:C.lime,letterSpacing:1,textTransform:"uppercase"}}>
              <TIcon t={typ}/> {tn?.sub}
            </div>
            {ph.extra.map((f,i)=><Flag key={f.id} f={f} n={ph.flags.length+i+1}/>)}
          </>)}
        </div>

        {/* Bottom nav */}
        <div style={{padding:"12px 16px 36px",borderTop:`1px solid ${C.ln}`,display:"flex",gap:8}}>
          {pi>0&&(
            <button onClick={()=>setPi(pi-1)} style={{padding:"13px 18px",background:C.s1,color:C.ink2,fontFamily:F.b,fontSize:13,fontWeight:600,border:`1px solid ${C.ln}`,borderRadius:10,display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
              <Ic d={P.back} s={14} c={C.ink2}/> Zurück
            </button>
          )}
          <button onClick={next} style={btn(C.lime,C.bg,{flex:1})}>{pi<phases.length-1?`${phases[pi+1].label} →`:"Auswertung →"}</button>
        </div>
      </div>)}

      {/* ══ SUMMARY ══ */}
      {scr==="summary"&&(<div style={{...bx}}>
        <div style={{padding:"24px 16px",textAlign:"center",borderBottom:`1px solid ${C.ln}`}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"10px 22px",borderRadius:10,fontFamily:F.b,fontSize:15,fontWeight:700,background:vd==="stop"?C.err1:vd==="caution"?C.wrn1:C.ok1,color:vd==="stop"?C.err:vd==="caution"?C.wrn:C.ok}}>
            {vd==="stop"?"🛑 Finger weg":vd==="caution"?"⚠️ Vorsicht":"✅ Prüfenswert"}
          </div>
          <div style={{fontSize:12,color:C.ink2,marginTop:6,lineHeight:1.5}}>{vd==="stop"?`${cN} kritische Probleme.`:vd==="caution"?`${nos.length} Probleme, ${cN} kritisch.`:"Keine kritischen Probleme."}</div>
          {tn&&<div style={{fontFamily:F.m,fontSize:9.5,color:C.ink3,marginTop:5}}>{tn.label} · {tn.sub}</div>}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.ln,borderRadius:10,overflow:"hidden",margin:"14px 16px"}}>
          {[[yC,"OK",C.ok],[nos.length,"Probleme",C.err],[sC,"Skip",C.ink3]].map(([v,l,col],i)=>(
            <div key={i} style={{background:C.s1,padding:"14px 6px",textAlign:"center"}}><div style={{fontFamily:F.b,fontSize:20,fontWeight:700,color:col}}>{v}</div><div style={{fontSize:8,color:C.ink3,textTransform:"uppercase",letterSpacing:.6,marginTop:2}}>{l}</div></div>
          ))}
        </div>
        {cH>0&&<div style={{margin:"0 16px 12px",padding:"14px 16px",background:C.wrn1,border:`1px solid ${C.wrn2}`,borderRadius:10}}>
          <div style={{fontFamily:F.m,fontSize:9,color:C.wrn,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Geschätzter Sanierungsbedarf</div>
          <div style={{fontFamily:F.b,fontSize:22,fontWeight:700,color:C.wrn}}>{fmtCHF(cL)} – {fmtCHF(cH)}</div>
          <div style={{fontSize:11,color:C.ink2,marginTop:4,lineHeight:1.5}}>Indikativ — für verbindliche Zahlen Sachverständigen beiziehen.</div>
        </div>}
        {nos.length>0&&<div style={{padding:"12px 16px"}}>
          <h3 style={{fontFamily:F.b,fontSize:14,fontWeight:700,marginBottom:10}}>Probleme ({nos.length})</h3>
          {phases.map(p=>af(p).filter(f=>ans[f.id]==="no").map(f=>(
            <div key={f.id} style={{background:C.s1,borderRadius:8,padding:"12px 14px",marginBottom:6,borderLeft:`3px solid ${f.sev===2?C.err:C.wrn}`}}>
              <div style={{fontFamily:F.m,fontSize:8.5,color:C.ink3,marginBottom:2}}>{p.label} · {f.sev===2?"Kritisch":"Wichtig"}</div>
              <div style={{fontSize:12.5,lineHeight:1.45}}>{f.text}</div>
              <div style={{fontSize:11,color:C.ink2,marginTop:4,lineHeight:1.5}}>{f.tip}</div>
              {f.cost&&f.cost[1]>0&&<div style={{fontFamily:F.m,fontSize:10,color:C.wrn,marginTop:4}}>{fmtCHF(f.cost[0])} – {fmtCHF(f.cost[1])}</div>}
            </div>
          )))}
        </div>}
        <div style={{padding:"12px 16px 36px"}}>
          <h3 style={{fontFamily:F.b,fontSize:14,fontWeight:700,marginBottom:10}}>Speichern</h3>
          <input value={nm} onChange={e=>setNm(e.target.value)} placeholder="z.B. «3.5 Zi ETW Altstadt Zug»" style={{width:"100%",padding:13,background:C.s2,border:`1px solid ${C.ln}`,borderRadius:10,color:C.ink,fontSize:14,outline:"none",boxSizing:"border-box"}}/>
          <div style={{marginTop:10}}><button onClick={save} disabled={!nm.trim()} style={{...btn(C.lime,C.bg),opacity:nm.trim()?1:.25}}><Ic d={P.save} s={15} c={C.bg}/> Speichern</button></div>
          <div style={{marginTop:8}}><button onClick={()=>{go("select");setTyp(null);setAns({});setT({});}} style={{width:"100%",padding:12,background:"transparent",border:`1px solid ${C.ln}`,borderRadius:10,color:C.ink2,fontFamily:F.b,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Ic d={P.refresh} s={13} c={C.ink2}/> Neue Inspektion</button></div>
          <div style={{marginTop:12,padding:"10px 12px",background:C.s2,border:`1px solid ${C.ln}`,borderRadius:8,fontSize:10,color:C.ink3,lineHeight:1.5}}>Alle Angaben indikativ. Kein Ersatz für Sachverständige, Notare oder Rechtsberatung.</div>
        </div>
      </div>)}

      {/* ══ SAVED LIST ══ */}
      {scr==="saved"&&!vid&&(<div style={{padding:16,...bx}}>
        <h3 style={{fontFamily:F.b,fontSize:18,fontWeight:700,display:"flex",alignItems:"center",gap:8,marginBottom:4}}><Ic d={P.folder} s={20} c={C.lime}/> Meine Immobilien</h3>
        <p style={{fontSize:12,color:C.ink2,marginBottom:16}}>{saved.length} Inspektionen</p>
        {saved.length===0&&<div style={{textAlign:"center",padding:28,color:C.ink3,fontSize:11}}>Noch keine Inspektionen.</div>}
        {saved.map(s=>(
          <div key={s.id} onClick={()=>setVid(s.id)} style={{background:C.s1,border:`1px solid ${C.ln}`,borderRadius:10,padding:12,marginBottom:8,cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600}}>{s.nm}</span><span style={{fontFamily:F.m,fontSize:9.5,color:C.ink3}}>{s.date}</span></div>
            <div style={{fontFamily:F.m,fontSize:9.5,color:C.ink3,margin:"2px 0 4px"}}>{s.type} · {s.sub}</div>
            <div style={{display:"flex",gap:10,fontSize:11}}><span style={{color:C.ok}}>✓ {s.yes}</span><span style={{color:C.err}}>✗ {s.no}</span>{s.cH>0&&<span style={{color:C.wrn}}>{fmtCHF(s.cL)}–{fmtCHF(s.cH)}</span>}</div>
            <div style={{marginTop:5,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{display:"inline-flex",padding:"3px 10px",borderRadius:6,fontSize:10,fontFamily:F.b,fontWeight:700,background:s.vd==="stop"?C.err1:s.vd==="caution"?C.wrn1:C.ok1,color:s.vd==="stop"?C.err:s.vd==="caution"?C.wrn:C.ok}}>{s.vd==="stop"?"🛑 Finger weg":s.vd==="caution"?"⚠️ Vorsicht":"✅ OK"}</span>
              <button onClick={e=>{e.stopPropagation();setSaved(p=>p.filter(x=>x.id!==s.id));}} style={{color:C.ink3,background:"none",border:"none",padding:8}}><Ic d={P.trash} s={12} c={C.ink3}/></button>
            </div>
          </div>
        ))}
      </div>)}

      {/* ══ SAVED DETAIL ══ */}
      {scr==="saved"&&vid&&(()=>{const s=saved.find(x=>x.id===vid);if(!s)return null;return(
        <div style={{...bx}}>
          <div style={{padding:16,borderBottom:`1px solid ${C.ln}`}}>
            <div style={{fontFamily:F.m,fontSize:9,color:C.ink3,letterSpacing:1,marginBottom:4}}>{s.date} · {s.type} · {s.sub}</div>
            {editNm===s.id?(
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <input autoFocus defaultValue={s.nm} onKeyDown={e=>{if(e.key==="Enter")renameSaved(s.id,e.target.value);}} style={{flex:1,padding:10,background:C.s2,border:`1px solid ${C.lime}`,borderRadius:8,color:C.ink,fontSize:15,fontFamily:F.b,fontWeight:700,outline:"none",boxSizing:"border-box"}}/>
                <button onClick={e=>{const input=e.target.parentElement.querySelector("input");renameSaved(s.id,input.value);}} style={{padding:"10px 14px",background:C.lime,color:C.bg,border:"none",borderRadius:8,fontFamily:F.b,fontSize:12,fontWeight:700}}>OK</button>
                <button onClick={()=>setEditNm(null)} style={{padding:"10px 12px",background:C.s2,color:C.ink3,border:`1px solid ${C.ln}`,borderRadius:8,fontFamily:F.b,fontSize:12}}>✗</button>
              </div>
            ):(
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <h3 style={{fontFamily:F.b,fontSize:18,fontWeight:700,flex:1}}>{s.nm}</h3>
                <button onClick={()=>setEditNm(s.id)} style={{padding:"6px 10px",background:C.s2,color:C.ink3,border:`1px solid ${C.ln}`,borderRadius:6,fontFamily:F.b,fontSize:10}}>Umbenennen</button>
              </div>
            )}
            <div style={{marginTop:8}}><span style={{display:"inline-flex",padding:"5px 14px",borderRadius:8,fontSize:12,fontFamily:F.b,fontWeight:700,background:s.vd==="stop"?C.err1:s.vd==="caution"?C.wrn1:C.ok1,color:s.vd==="stop"?C.err:s.vd==="caution"?C.wrn:C.ok}}>{s.vd==="stop"?"🛑 Finger weg":s.vd==="caution"?"⚠️ Vorsicht":"✅ OK"}</span></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:1,background:C.ln,borderRadius:10,overflow:"hidden",margin:"14px 16px"}}>
            {[[s.yes,"OK",C.ok],[s.no,"Probleme",C.err],[s.skip||0,"Skip",C.ink3]].map(([v,l,col],i)=>(
              <div key={i} style={{background:C.s1,padding:"12px 6px",textAlign:"center"}}><div style={{fontFamily:F.b,fontSize:18,fontWeight:700,color:col}}>{v}</div><div style={{fontSize:8,color:C.ink3,textTransform:"uppercase",letterSpacing:.5,marginTop:2}}>{l}</div></div>
            ))}
          </div>
          {s.cH>0&&<div style={{margin:"0 16px 12px",padding:"12px 14px",background:C.wrn1,borderRadius:10}}><div style={{fontFamily:F.m,fontSize:9,color:C.wrn,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Sanierungsbedarf</div><div style={{fontFamily:F.b,fontSize:20,fontWeight:700,color:C.wrn}}>{fmtCHF(s.cL)} – {fmtCHF(s.cH)}</div></div>}
          {s.details?.length>0&&<div style={{padding:"12px 16px"}}><h3 style={{fontFamily:F.b,fontSize:13,fontWeight:700,marginBottom:8}}>Probleme ({s.details.length})</h3>
            {s.details.map((d,i)=><div key={i} style={{background:C.s1,borderRadius:8,padding:"10px 12px",marginBottom:6,borderLeft:`3px solid ${d.sev===2?C.err:C.wrn}`}}><div style={{fontFamily:F.m,fontSize:8.5,color:C.ink3,marginBottom:2}}>{d.phase}</div><div style={{fontSize:12,lineHeight:1.4}}>{d.text}</div><div style={{fontSize:10.5,color:C.ink2,marginTop:3,lineHeight:1.45}}>{d.tip}</div>{d.cost&&d.cost[1]>0&&<div style={{fontFamily:F.m,fontSize:10,color:C.wrn,marginTop:4}}>{fmtCHF(d.cost[0])} – {fmtCHF(d.cost[1])}</div>}</div>)}
          </div>}
          <div style={{padding:"12px 16px 32px"}}>
            {s.answers&&s.tId&&<button onClick={()=>resumeCheck(s)} style={{width:"100%",padding:14,background:C.lime,color:C.bg,border:"none",borderRadius:10,fontFamily:F.b,fontSize:14,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",gap:5,marginBottom:8}}>Check weiter bearbeiten</button>}
            <button onClick={()=>{setSaved(p=>p.filter(x=>x.id!==s.id));setVid(null);}} style={{width:"100%",padding:12,background:"transparent",border:`1px solid ${C.ln}`,borderRadius:10,color:C.ink3,fontFamily:F.b,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><Ic d={P.trash} s={13} c={C.ink3}/> Löschen</button>
          </div>
        </div>
      );})()}

      </div>
    </div>
  </>);
}
