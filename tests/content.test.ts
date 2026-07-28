import { describe, expect, it } from "vitest";

import { builtInCards } from "../src/content/cards";
import { CATEGORIES, STAGES } from "../src/game";

const rejectedFromRankedReview = [
  "Как любовь братства ощущается в обычных делах?",
  "Что в хорошем разговоре ободряет и того, кто служит?",
  "Какая приготовленная мысль подходит к разным ситуациям?",
  "О какой общей истории приятно поговорить с друзьями?",
  "Что может изменить один звонок или сообщение?",
  "Какой добрый поступок соседа или незнакомца особенно ценен?",
  "Что удалось перенять у кого-то младше?",
  "Что ободряет во встречах с братьями и сёстрами из других мест?",
  "Какой добрый поступок однажды захотелось повторить?",
  "Какой поступок Варнавы тебе хотелось бы увидеть своими глазами?",
  "Чей голос из библейских персонажей тебе было бы интересно однажды услышать?",
  "Какой псалом включишь тому, кому сейчас тревожно?",
  "Чей выбор в Библии тебе особенно интересен? Почему?",
  "О чьей дружбе в Библии тебе хотелось бы узнать больше подробностей?",
  "Какому моменту сегодняшнего вечера хочется дать отдельное название?",
  "Как можно было бы назвать сегодняшнюю компанию двумя словами?",
  "Какой вопрос хотелось бы задать всей группе перед концом круга?",
  "Какую историю из сегодняшнего разговора тебе хочется дослушать после игры?",
  "Какую традицию можно завести, чтобы не теряться по разным городам?",
  "Какую песню хотелось бы первой добавить в общий плейлист для дороги?",
  "Кто из компании мог бы провести интересный мастер-класс? О чём?",
  "Дай обычному случаю из своей жизни название как у фильма.",
  "Расскажи о своём маленьком приключении голосом спортивного комментатора.",
  "Придумай короткую историю, где погода меняет все планы.",
  "Опиши хороший день так, будто это короткий трейлер к фильму.",
  "Придумай короткую историю о потерянной вещи, которая нашлась.",
  "Расскажи о неожиданной встрече, а группа пусть придумает ей название.",
  "Покажи смешной технический сбой жестами, а потом расскажи, что произошло.",
  "Как проще всего начать приятное знакомство?",
  "Что может отличаться в служении в разных местах?",
  "Как приветствие на знакомом человеку языке меняет настроение разговора?",
  "Чему в служении можно научиться у человека другого возраста?",
  "Какой добрый ответ в служении может вызвать улыбку?",
  "Как спокойно отнестись к собственной оговорке в служении?",
  "Какой вопрос о служении хочется задать группе?",
  "Изобрази будильник, который очень старается быть деликатным.",
  "Покажи, как выглядел бы очень вежливый кот.",
  "Покажи жестами своё настроение, не используя лицо.",
  "Придумай новое название для понедельника.",
  "Покажи реакцию на неожиданный громкий звук.",
  "Изобрази детскую попытку вести себя совсем по-взрослому.",
  "Скажи кому-нибудь: «Твой ответ сегодня меня приятно удивил».",
  "Покажи лицом реакцию «Это и у меня так», не произнося ни слова.",
  "Какую вещь из своего детства хотелось бы сейчас показать этой компании?",
  "Чей ответ сегодня сильнее всего заставил тебя улыбнуться?",
  "Опиши смешной момент так, будто это срочная новость.",
  "Расскажи начало истории и остановись перед финалом, чтобы группа попробовала его угадать.",
  "Разыграйте техническую накладку во время служения по телефону.",
  "Разыграйте телефонный разговор в служении, который пошёл не по плану.",
  "Где было бы забавно провести следующую встречу?",
  "Объяви вымышленный поезд до Луны голосом диктора на вокзале.",
  "Покажи без слов фразу: «Подожди, я тебя не слышу».",
  "Как бы называлась комедия про сегодняшний вечер?",
  "Закончи фразу: «Сегодня неожиданно выяснилось, что...»",
  "Какое животное из Библии было бы труднее всего изобразить без слов?",
  "Что обязательно возьмёшь с собой в путешествие вместе с Авраамом?",
] as const;

const approvedFromRankedReview = [
  "Какая фраза из твоего детства могла бы быть знакома и остальным?",
  "Изобрази человека, который впервые увидел настоящий снег.",
  "Замри так, будто тебя застали за тайным поеданием сладкого.",
  "Скажи «Я всё слышу» тремя совершенно разными интонациями.",
  "Выбери кого-нибудь и угадай, что ближе этому человеку: утро или вечер. Потом проверь ответ.",
  "Какому своему навыку можно прямо сейчас немного научить друзей?",
  "За ужином какой библейской семьи тебе было бы интересно посидеть?",
] as const;

const strongCardsFromFullDeckReview = [
  "Какой твой поступок в детстве привёл взрослых в шок?",
  "Замри так, будто тебя застали за тайным поеданием сладкого.",
  "Какой дружеский совет сначала казался несерьёзным, а потом всё-таки пригодился?",
  "Покажи вещь рядом с собой, с которой связана хорошая история.",
  "Выбери кого-нибудь и угадай, что ближе этому человеку: утро или вечер. Потом проверь ответ.",
  "Расскажи о первой попытке сделать в детстве что-то по-взрослому.",
  "Покажи предмет рядом так, будто это редчайший музейный экспонат.",
  "Позови кого-нибудь: один показывает сцену, другой её озвучивает.",
  "Объяви посадку на ковчег Ноя голосом диктора.",
] as const;

const questionReviewReplacementAnchors = [
  "Какое качество Иеговы стало для тебя особенно реальным благодаря личному опыту?",
  "Какое уточнение в понимании Библии особенно помогло тебе лучше узнать Иегову?",
  "От чего пришлось отказаться ради духовных целей и о чём ты не жалеешь?",
  "Кого из библейских персонажей напоминает каждый в вашей компании? Назови только добрые черты.",
  "В какой стране тебе хотелось бы попробовать миссионерское служение? Почему именно там?",
  "Хотелось бы тебе попробовать районное или вефильское служение? Что именно привлекает?",
  "За что в своей жизни ты чувствуешь наибольшую благодарность?",
  "Если бы можно было изменить что-то в своём воспитании, что именно?",
  "Расскажи короткую историю своей жизни через три самых важных поворота.",
  "С каким новым качеством или умением хотелось бы проснуться завтра?",
] as const;

describe("built-in deck", () => {
  it("contains exactly 360 unique cards", () => {
    expect(builtInCards).toHaveLength(360);
    expect(new Set(builtInCards.map((card) => card.id)).size).toBe(360);
    expect(new Set(builtInCards.map((card) => card.text.toLocaleLowerCase("ru-RU"))).size).toBe(360);
  });

  it("is balanced by stage and category", () => {
    for (const stage of STAGES) {
      expect(builtInCards.filter((card) => card.stage === stage)).toHaveLength(120);
    }
    for (const category of CATEGORIES) {
      expect(builtInCards.filter((card) => card.category === category)).toHaveLength(72);
    }
    for (const stage of STAGES) {
      for (const category of CATEGORIES) {
        expect(builtInCards.filter((card) => card.stage === stage && card.category === category)).toHaveLength(24);
      }
    }
  });

  it("keeps every prompt readable and free of design-tell dashes", () => {
    for (const card of builtInCards) {
      expect(card.text.length).toBeGreaterThanOrEqual(24);
      expect(card.text.length).toBeLessThanOrEqual(220);
      expect(card.text).not.toMatch(/[—–]/u);
      expect(card.text).toMatch(/[.?!][»”"]?$/u);
      expect(card.source).toBe("builtIn");
    }
  });

  it("keeps every built-in card text-only", () => {
    builtInCards.forEach((card) => expect(Object.hasOwn(card, "visual")).toBe(false));
  });

  it("varies the spoken opening instead of leaning on two generated templates", () => {
    const tellOpenings = builtInCards.filter((card) => card.text.startsWith("Расскажи"));
    const whichOpenings = builtInCards.filter((card) => /^(Какой|Какая|Какое|Какую|Какие)\b/u.test(card.text));

    expect(tellOpenings.length).toBeLessThanOrEqual(35);
    expect(tellOpenings.length + whichOpenings.length).toBeLessThanOrEqual(120);
  });

  it("does not contain the reported abstract or confusing prompts", () => {
    const deck = builtInCards.map((card) => card.text).join("\n");
    expect(deck).not.toContain("Что ты умеешь ценить только после небольшой паузы?");
    expect(deck).not.toContain("Какой твой выбор обычно удивляет людей, которые плохо тебя знают?");
    expect(deck).not.toContain("Изобрази Илию, который слышит тихий спокойный голос.");
    expect(deck).not.toContain("Придумай группе добрый вызов до следующей встречи.");
    expect(deck).not.toContain("Назови одно качество каждого из двух участников, которое пригодилось бы в совместном служении.");
    expect(deck).not.toContain("Какая короткая беседа в служении способна ободрить на весь день?");
    expect(deck).not.toContain("Какая короткая беседа в служении может ободрить на весь день?");
    expect(deck).not.toMatch(/или придумай (?:её|такой)/iu);
    expect(deck).not.toContain("Как ответишь в служении на неожиданный вопрос?");
    expect(deck).not.toContain("Как лучше реагировать на неожиданный вопрос в служении?");
  });

  it("does not contain the prompts reported after live play", () => {
    const deck = builtInCards.map((card) => card.text);
    const rejected = [
      "Покажи без слов, как ты ищешь место на переполненной парковке.",
      "Расскажи о поездке, которая пошла не по плану, но всё равно удалась.",
      "Какое время дня для служения тебе нравится больше всего?",
      "Как совместное служение помогло тебе лучше узнать друга?",
      "Какой совместный труд особенно сблизил тебя с кем-то?",
      "Какой пример напарника научил тебя говорить проще?",
      "Попроси всех за пять секунд найти в кадре предмет одного цвета.",
      "Начни медленную волну, которую повторит весь круг.",
      "Что делает перерыв после служения особенно приятным?",
      "Разыграйте втроём сцену, где все уступают друг другу место.",
      "Какое путешествие из Библии повторишь только на современном транспорте?",
      "Расскажи самый смешной случай из служения, который никого не выставляет в неловком свете.",
      "О чём спросишь Авраама после одного из его долгих переходов?",
      "Когда одной короткой фразы оказалось достаточно, чтобы поддержать человека?",
      "Вспомни историю, которая всегда вызывает улыбку у твоих друзей.",
      "Дай смешное название кадру, который сейчас видят все.",
      "Какой предмет на картинке мог бы остаться после твоей детской выходки? Что тогда случилось?",
      "Какой трудный выбор библейского персонажа хотелось бы обсудить с группой?",
      "Выберите по одному дереву для дома в новом мире. Почему именно это?",
      "Покажи без слов, что ты уже минуту говоришь с выключенным микрофоном.",
      "Какой обычный вопрос помог человеку разговориться?",
      "Куда из этих мест вся компания отправилась бы на выходной? Что бы вы там делали?",
      "Какая встреча в Zoom оказалась веселее, чем ожидалось?",
      "Что из детских лакомств и сейчас вызывает аппетит?",
      "Расскажи о неожиданном госте или видеозвонке, который тебя порадовал.",
      "Какую вещь в детстве получилось спрятать так хорошо, что потом пришлось долго искать?",
      "Как прошёл твой первый день в непривычном для тебя виде служения?",
      "Позови кого-нибудь и разыграйте сцену без слов с живой озвучкой.",
      "Какой небольшой сувенир из знакомого места хотелось бы показать этой компании?",
      "Если доводилось служить в другом городе или стране, что там оказалось неожиданным?",
    ];

    rejected.forEach((prompt) => expect(deck).not.toContain(prompt));
  });

  it("applies player reviews while keeping prompts that were not superseded", () => {
    const deck = builtInCards.map((card) => card.text);

    rejectedFromRankedReview.forEach((prompt) => expect(deck).not.toContain(prompt));
    approvedFromRankedReview.forEach((prompt) => expect(deck).toContain(prompt));
    questionReviewReplacementAnchors.forEach((prompt) => expect(deck).toContain(prompt));
  });

  it("keeps the strongest cards and limits ministry advice templates", () => {
    const deck = builtInCards.map((card) => card.text);
    const ministryAdviceTemplates = builtInCards.filter(
      (card) => card.category === "service" && card.text.startsWith("Что помогает"),
    );

    strongCardsFromFullDeckReview.forEach((prompt) => expect(deck).toContain(prompt));
    expect(ministryAdviceTemplates.length).toBeLessThanOrEqual(12);
  });

  it("keeps group cards compatible with two people in one room or over video", () => {
    const groupDeck = builtInCards
      .filter((card) => card.mode !== "answer")
      .map((card) => card.text.toLocaleLowerCase("ru-RU"))
      .join("\n");
    const roomOnlyFragments = [
      "человеку слева",
      "человеку справа",
      "втроём",
      "трем участникам",
      "трём участникам",
      "двух участников",
      "двум участникам",
      "уступают друг другу место",
      "медленную волну",
    ];

    roomOnlyFragments.forEach((fragment) => expect(groupDeck).not.toContain(fragment));
  });

  it("does not require an online play environment", () => {
    const deck = builtInCards.map((card) => card.text).join("\n");
    const nonServiceDeck = builtInCards
      .filter((card) => card.category !== "service")
      .map((card) => card.text)
      .join("\n");

    expect(deck).not.toMatch(/\bZoom\b|(?<![а-яё])зум(?![а-яё])|в кадре|чьём-то кадре|на экране|микрофон|интернет|скриншот|виртуальн[^.?!]{0,30}фон/iu);
    expect(deck).not.toMatch(/связь наконец восстановилась/iu);
    expect(nonServiceDeck).not.toMatch(/видеосвяз/iu);
  });

  it("does not assume a shared country, language, city, or ministry experience", () => {
    const deck = builtInCards.map((card) => card.text).join("\n");
    expect(deck).not.toMatch(/украин|україн|киев|київ|львов|львів|одесс|одес|карпат/iu);
    expect(deck).not.toMatch(/с друзьями, которых знаешь сейчас/iu);
    expect(deck).not.toMatch(/\b(?:вспомни|вспомните|помнишь)\b/iu);
    expect(deck).not.toMatch(/в другом городе|в другой стране|за границей|общественное свидетельствование/iu);
    expect(deck).not.toMatch(/вопрос ребёнка|ребёнок спросил/iu);

    const pioneerPrompts = builtInCards.filter((card) => /пионер/iu.test(card.text));
    pioneerPrompts.forEach((card) => {
      expect(card.text).toMatch(/^Если у тебя есть опыт пионерского служения/iu);
      expect(card.text).toContain("Если нет, спроси кого-нибудь.");
    });
  });

  it("keeps the approved childhood and spiritual themes present without taking over the deck", () => {
    const childhoodCards = builtInCards.filter((card) => /детств|ребён|маленьк|мультфильм|школ/iu.test(card.text));
    const newWorldCards = builtInCards.filter((card) => /новом мире|новый мир/iu.test(card.text));
    const spiritualStoryCards = builtInCards.filter((card) => /истин|Иегов|братств/iu.test(card.text));

    expect(childhoodCards.length).toBeGreaterThanOrEqual(20);
    expect(childhoodCards.length).toBeLessThanOrEqual(48);
    expect(newWorldCards.length).toBeGreaterThanOrEqual(8);
    expect(newWorldCards.length).toBeLessThanOrEqual(20);
    expect(spiritualStoryCards.length).toBeGreaterThanOrEqual(12);
  });

  it("keeps the most personal spiritual questions out of the opening stage", () => {
    const deeperCards = builtInCards.filter((card) =>
      /истина появилась|полюбить Иегову|благодарен Иегове|любишь наше братство|любовь братства|поступке брата или сестры/iu.test(card.text),
    );

    expect(deeperCards.length).toBeGreaterThanOrEqual(5);
    deeperCards.forEach((card) => expect(card.stage).not.toBe("spark"));
  });

  it("keeps the approved anchor questions in the deck", () => {
    const deck = builtInCards.map((card) => card.text);

    expect(deck).toEqual(
      expect.arrayContaining([
        "Какой твой поступок в детстве привёл взрослых в шок?",
        "Расскажи, как истина появилась в твоей жизни.",
        "Что помогло тебе по-настоящему полюбить Иегову?",
        "За что тебе сейчас особенно хочется благодарить Иегову?",
        "За что ты особенно любишь наше братство?",
        "Какое ремесло или хобби хочется освоить в новом мире?",
        "Каким будет твой дом в новом мире? Что будет рядом?",
        "Какая работа или обязанность научила тебя чему-то неожиданному?",
        "Какой библейский рассказ или стих открылся тебе по-новому на другом языке?",
      ]),
    );
  });

  it("uses closeness mechanics without high-pressure disclosure prompts", () => {
    const deck = builtInCards.map((card) => card.text).join("\n");

    expect(deck).not.toMatch(
      /хрустальн[^.?!]{0,30}шар|как[^.?!]{0,30}умр|через год[^.?!]{0,30}умр|дом[^.?!]{0,40}загор|чья смерть|ужасное воспоминание|когда[^.?!]{0,30}плак|как тебя любить|безопасност[^.?!]{0,30}открыва|личн[^.?!]{0,30}проблем/iu,
    );
    expect(deck).toEqual(
      expect.stringContaining("Что для тебя самое важное в дружбе?"),
    );
    expect(deck).toEqual(
      expect.stringContaining("Из каких поступков для тебя складывается доверие?"),
    );
    expect(deck).toEqual(
      expect.stringContaining("Как друзья могут лучше всего проявить к тебе заботу?"),
    );
  });

  it("addresses players without assuming gender", () => {
    const genderedForms = [
      "мог",
      "был",
      "хотел",
      "научился",
      "начал",
      "встречал",
      "готовил",
      "служил",
      "растерялся",
      "согласился",
      "спросил",
      "увидел",
      "собирался",
      "устроил",
      "искал",
      "понял",
      "забыл",
      "принял",
      "попробовал",
      "мечтал",
      "получил",
      "ожидал",
      "любил",
      "отправил",
      "гордился",
      "почувствовал",
      "решил",
      "добавил",
      "назвал",
      "попытался",
      "оговорился",
      "сумел",
      "пожалел",
      "съел",
      "носил",
      "рад",
      "готов",
      "одет",
      "первым",
      "сам",
      "могла",
      "была",
      "хотела",
      "научилась",
      "начала",
      "встречала",
      "готовила",
      "служила",
      "растерялась",
      "согласилась",
      "спросила",
      "увидела",
      "собиралась",
      "устроила",
      "искала",
      "поняла",
      "забыла",
      "приняла",
      "попробовала",
      "мечтала",
      "получила",
      "ожидала",
      "любила",
      "отправила",
      "гордилась",
      "почувствовала",
      "решила",
      "добавила",
      "назвала",
      "попыталась",
      "оговорилась",
      "сумела",
      "пожалела",
      "съела",
      "носила",
      "рада",
      "готова",
      "одета",
      "сама",
      "благодарен",
      "благодарна",
      "уверен",
      "уверена",
      "должен",
      "должна",
      "согласен",
      "согласна",
      "виноват",
      "виновата",
      "свободен",
      "свободна",
      "занят",
      "занята",
      "прав",
      "права",
      "способен",
      "способна",
      "вынужден",
      "вынуждена",
      "знаком",
      "знакома",
    ].join("|");
    const afterYou = new RegExp(`ты[^?!]{0,100}(?<![\\p{L}])(?:${genderedForms})(?![\\p{L}])`, "iu");
    const beforeYou = new RegExp(
      `(?<![\\p{L}])(?:${genderedForms})(?![\\p{L}])[^?!]{0,40}(?:ли )?ты`,
      "iu",
    );
    const singularGroupRole = /выбери (?:любого )?участника|позови участника|другой участник|следующий участник/iu;
    const genderedDirectRole = /ты\s+(?:ведущий|ведущая|герой|героиня|актёр|актриса)\b/iu;

    builtInCards.forEach((card) => {
      expect(card.text).not.toMatch(afterYou);
      expect(card.text).not.toMatch(beforeYou);
      expect(card.text).not.toMatch(singularGroupRole);
      expect(card.text).not.toMatch(genderedDirectRole);
      expect(card.text).not.toMatch(/\([а-яё]\)/iu);
      expect(card.text).not.toContain("«Сегодня я не ожидал");
      expect(card.text).not.toContain("«Полностью согласен»");
    });
  });

  it("does not bring back the abstract prompts removed by the editorial pass", () => {
    const deck = builtInCards.map((card) => card.text).join("\n");
    const rejectedFragments = [
      "Что после тяжёлого дня помогает тебе больше",
      "Как тебе удаётся не терять связь",
      "Что делает видеозвонок похожим",
      "Что о человеке быстрее узнаёшь",
      "по одному качеству, которое цените в напарнике",
      "всего из пяти слов",
      "по которому он так скучал",
      "а вокруг никто не понимает зачем",
    ];

    rejectedFragments.forEach((fragment) => expect(deck).not.toContain(fragment));
  });
});
