(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var PAGE_OUT_MS = 520;
  var lenisRef = null;
  var IMG_FALLBACK = "images/shared/thames.jpg";

  function isInSiteSubfolder() {
    try {
      var path = (window.location.pathname || "").replace(/\\/g, "/");
      var tail = path.toLowerCase();
      return tail.indexOf("/pages/") !== -1 || tail.indexOf("/guides/") !== -1;
    } catch (e) {
      return false;
    }
  }

  function resolveSiteHref(href) {
    if (!href) return href;
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
    if (isInSiteSubfolder()) return "../" + href;
    return href;
  }

  function resolveAssetSrc(src) {
    if (!src || /^[a-z][a-z0-9+.-]*:/i.test(src)) return src;
    if (isInSiteSubfolder() && src.indexOf("images/") === 0) return "../" + src;
    return src;
  }
  /* Wikimedia: use standard thumb widths (1280px etc.); non-standard sizes return 429. */
  var REMOTE_THAMES =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/London_Thames_Sunset_panorama_-_Feb_2008.jpg/1280px-London_Thames_Sunset_panorama_-_Feb_2008.jpg";
  var REMOTE_BY_LOCAL = {
    "images/shared/thames.jpg": REMOTE_THAMES,
    "images/sights/british-facade.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/British_Museum_Facade.JPG/1280px-British_Museum_Facade.JPG",
    "images/sights/national-gallery-front.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_036.JPG/1280px-Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_036.JPG",
    "images/sights/sky-garden.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/The_Sky_Garden.jpg/1280px-The_Sky_Garden.jpg",
    "images/eats/borough-market.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/London_2018_March_IMG_0663.jpg/1280px-London_2018_March_IMG_0663.jpg",
    "images/eats/pizza-plate.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Pizza-3007395.jpg/1280px-Pizza-3007395.jpg",
    "images/eats/latte.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Latte_and_dark_coffee.jpg/1280px-Latte_and_dark_coffee.jpg",
    "images/transport/bus-hopper.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Arriva_London_bus_LT6_%28LT12_FHT%29%2C_route_38%2C_16_April_2013_%282%29.jpg/1280px-Arriva_London_bus_LT6_%28LT12_FHT%29%2C_route_38%2C_16_April_2013_%282%29.jpg",
    "images/transport/tube-zones.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Why_London_Underground_is_nicknamed_The_Tube.jpg/1280px-Why_London_Underground_is_nicknamed_The_Tube.jpg",
    "images/transport/oyster-card.png":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Oyster_Card_front.svg/960px-Oyster_Card_front.svg.png",
    "images/transport/contactless-reader.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Oyster-Reader.jpg/1280px-Oyster-Reader.jpg",
    "images/transport/river-thames-bridge.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tower_Bridge_from_Shad_Thames.jpg/1280px-Tower_Bridge_from_Shad_Thames.jpg",
    "images/transport/cycling-london.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Cycling_in_London.jpg/1280px-Cycling_in_London.jpg",
    "images/eats/new-market-exterior.jpg":
      "https://commons.wikimedia.org/wiki/Special:FilePath/Borough_Market_-_Southwark_Street_London_SE1_1TL.jpg?width=1280",
    "images/eats/new-tacos.jpg":
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tacos_Padre,_Borough_Market.jpg?width=1280",
    "images/transport/new-night-bus.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/London_Night_bus_N8_in_Bloomsbury.jpg/1280px-London_Night_bus_N8_in_Bloomsbury.jpg",
    "images/transport/new-tube-entrance.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Archway_station_main_entrance.JPG/1280px-Archway_station_main_entrance.JPG",
    "images/transport/new-oyster-reader.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Oyster-Reader.jpg/1280px-Oyster-Reader.jpg",
    "images/transport/new-oyster-reader-2.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/TfL_Oyster_Card_reader.jpg/1280px-TfL_Oyster_Card_reader.jpg",
    "images/shared/phonebox.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Red_telephone_box%2C_St_Paul%27s_Cathedral%2C_London%2C_England%2C_GB%2C_IMG_5182_edit.jpg/1280px-Red_telephone_box%2C_St_Paul%27s_Cathedral%2C_London%2C_England%2C_GB%2C_IMG_5182_edit.jpg",
    "images/sights/great-court.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/British_Museum_Great_Court%2C_London%2C_UK_-_Diliff.jpg/1280px-British_Museum_Great_Court%2C_London%2C_UK_-_Diliff.jpg",
    "images/sights/rosetta.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Rosetta_Stone.JPG/1280px-Rosetta_Stone.JPG",
    "images/sights/wilkins.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/William_Wilkins%27s_building.JPG/1280px-William_Wilkins%27s_building.JPG",
    "images/sights/sunflowers.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflowers_National_Gallery.jpg/1280px-Sunflowers_National_Gallery.jpg",
    "images/sights/walkie-talkie.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Walkie-Talkie_-_Sept_2015.jpg/1280px-Walkie-Talkie_-_Sept_2015.jpg",
    "images/sights/fenchurch-sunset.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Cmglee_London_20_Fenchurch_Street_sunset.jpg/1280px-Cmglee_London_20_Fenchurch_Street_sunset.jpg",
    "images/eats/borough-cake.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Borough_Market_cake_stall%2C_London%2C_England_-_Oct_2008.jpg/1280px-Borough_Market_cake_stall%2C_London%2C_England_-_Oct_2008.jpg",
    "images/eats/borough-veg.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/BoroughMarketVegetableStall.jpg/1280px-BoroughMarketVegetableStall.jpg",
    "images/eats/pizza-toss.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Pizza_being_tossed.jpg/1280px-Pizza_being_tossed.jpg",
    "images/eats/coffee-beans.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Coffee_beans_unroasted.jpg/1280px-Coffee_beans_unroasted.jpg",
    "images/eats/english-breakfast.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/English_breakfast_2.jpg/1280px-English_breakfast_2.jpg",
    "images/eats/full-english.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Full_English_Breakfast.JPG/1280px-Full_English_Breakfast.JPG",
    "images/eats/fish-chips.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Fish_and_chips.jpg/1280px-Fish_and_chips.jpg",
    "images/eats/falafel.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Falafel.jpg/1280px-Falafel.jpg",
    "images/eats/chicken-curry.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Chicken_curry.jpg/1280px-Chicken_curry.jpg",
    "images/sights/tate-modern.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Tate_modern.jpg/1280px-Tate_modern.jpg",
    "images/sights/tate-turbine.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/The_Turbine_Hall%2C_Tate_Modern_-_geograph.org.uk_-_2524607.jpg/1280px-The_Turbine_Hall%2C_Tate_Modern_-_geograph.org.uk_-_2524607.jpg",
    "images/sights/nh-facade.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Natural_History_Museum_London_South_Facade_2020_01.jpg/1280px-Natural_History_Museum_London_South_Facade_2020_01.jpg",
    "images/sights/nh-dippy.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Dippy_the_diplodocus_in_the_HIntze_Hall_at_the_Natural_HIstory_Museum.jpg/1280px-Dippy_the_diplodocus_in_the_HIntze_Hall_at_the_Natural_HIstory_Museum.jpg",
    "images/sights/nh-hintze.jpg":
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Hintze_Hall_ceiling_and_arches_from_east_alcove.jpg/1280px-Hintze_Hall_ceiling_and_arches_from_east_alcove.jpg",
  };

  function attachImageFallback(img) {
    if (!img || img.dataset.fallbackBound === "true") return;
    img.dataset.fallbackBound = "true";
    img.addEventListener("error", function () {
      if (img.dataset.imgTry === "2") return;
      var rel = img.getAttribute("src");
      if (!rel || rel.indexOf("images/") !== 0) {
        try {
          var u = new URL(img.src, document.baseURI);
          var p = u.pathname;
          var ix = p.indexOf("/images/");
          if (ix >= 0) rel = p.slice(ix + 1);
        } catch (e) {}
      }
      if (img.dataset.imgTry !== "1" && rel && REMOTE_BY_LOCAL[rel]) {
        img.dataset.imgTry = "1";
        img.src = REMOTE_BY_LOCAL[rel];
        return;
      }
      img.dataset.imgTry = "2";
      img.src = REMOTE_THAMES;
    });
  }

  function normalizePhoto(entry) {
    if (typeof entry === "string") {
      return { src: entry, caption: "" };
    }
    return {
      src: entry.src,
      caption: entry.caption || "",
    };
  }

  var PLACE_DATA = {
    "home-free-sights": {
      title: "Free sights in London",
      html:
        "<p>World-famous museums with no entry fee, river walks, and viewpoints like Sky Garden (book a free slot). Weekday mornings are the calmest at big museums.</p>",
      photos: [
        {
          src: "images/sights/british-facade.jpg",
          caption:
            "British Museum: main entrance on Great Russell Street — free entry to the permanent galleries.",
        },
        {
          src: "images/sights/national-gallery-front.jpg",
          caption:
            "National Gallery: the building on the north side of Trafalgar Square.",
        },
        {
          src: "images/sights/sky-garden.jpg",
          caption:
            "Sky Garden: indoor gardens and viewing terraces at the top of 20 Fenchurch Street — book a free slot in advance.",
        },
      ],
      href: "pages/free-sights.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5089,-0.1283",
      guideHref: "pages/free-sights.html",
    },
    "home-cheap-eats": {
      title: "Cheap eats",
      html:
        "<p>Cafés, caff fry-ups, pub lunch boards, food halls, and Borough-style markets keep sit-down meals under £10–12 — speciality coffee plus pastry is cheap fuel before museums.</p>",
      photos: [
        {
          src: "images/eats/new-market-exterior.jpg",
          caption:
            "Morning: indie cafés often pair a flat white with a pastry for less than a chain brunch.",
        },
        {
          src: "images/eats/new-tacos.jpg",
          caption:
            "Lunch: falafel, curry shops, and small restaurants do filling plates around £6–9 away from the main strips.",
        },
        {
          src: "images/eats/new-market-exterior.jpg",
          caption:
            "Borough Market: grills, bread, and traders by London Bridge — one hot dish, then the Thames for a free view.",
        },
      ],
      href: "pages/cheap-eats.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5055,-0.0910",
      guideHref: "pages/cheap-eats.html",
    },
    "home-transport": {
      title: "Getting around",
      html:
        "<p>Oyster or contactless on TfL: same fares, automatic daily caps, and the bus Hopper for unlimited connections within an hour. Touch out on rail even if barriers are open — missing a touch can trigger a maximum fare.</p>",
      photos: [
        {
          src: "images/transport/new-night-bus.jpg",
          caption:
            "New Routemaster buses: hop on at the back with Oyster or contactless — flat fare across London’s bus area.",
        },
        {
          src: "images/transport/new-tube-entrance.jpg",
          caption:
            "The Tube: deep-level tunnels and frequent trains — fastest for long hops across zones.",
        },
        {
          src: "images/transport/new-oyster-reader.jpg",
          caption:
            "Oyster card: same fares as contactless; top up at stations or use the TfL app.",
        },
      ],
      href: "pages/transport.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5074,-0.1278",
      guideHref: "pages/transport.html",
    },
    "home-contact": {
      title: "Contact",
      html:
        "<p>Send feedback or route ideas through the form. For tickets and live times, always check official museum and TfL sites.</p>",
      photos: [
        {
          src: "images/shared/phonebox.jpg",
          caption:
            "Classic K6 red phone boxes are still easy to spot near St Paul’s and the centre.",
        },
        {
          src: "images/shared/thames.jpg",
          caption:
            "The Thames at sunset — free views along the South Bank between museums and markets.",
        },
      ],
      href: "pages/contact.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5074,-0.1278",
      guideHref: "pages/contact.html",
    },
    "sight-british": {
      title: "British Museum",
      html:
        "<p>Highlights include the Rosetta Stone, Egyptian mummies, and the Parthenon galleries. Free entry; special exhibitions are usually paid. Arrive early on weekdays to skip the longest queues.</p>",
      photos: [
        {
          src: "images/sights/british-facade.jpg",
          caption:
            "South façade on Great Russell Street — this is the usual visitor entrance.",
        },
        {
          src: "images/sights/great-court.jpg",
          caption:
            "The Great Court and the Reading Room under the glass roof — start here to get your bearings.",
        },
        {
          src: "images/sights/rosetta.jpg",
          caption:
            "The Rosetta Stone — one of the most visited objects; go early if you want a clear view.",
        },
      ],
      href: "pages/free-sights.html",
      guideHref: "guides/british-museum.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5194,-0.1270",
    },
    "sight-national": {
      title: "National Gallery",
      html:
        "<p>European paintings from Van Eyck to Van Gogh, free permanent galleries on Trafalgar Square. Temporary shows and audio guides are often extra.</p>",
      photos: [
        {
          src: "images/sights/national-gallery-front.jpg",
          caption:
            "Portico and steps facing Trafalgar Square — main entry to the free permanent collection.",
        },
        {
          src: "images/sights/wilkins.jpg",
          caption:
            "Wilkins’ neoclassical building (1830s) — the National Gallery has expanded with newer wings behind.",
        },
        {
          src: "images/sights/sunflowers.jpg",
          caption:
            "Van Gogh’s Sunflowers — one of the gallery’s best-known paintings in the permanent galleries.",
        },
      ],
      href: "pages/free-sights.html",
      guideHref: "guides/national-gallery.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5089,-0.1283",
    },
    "sight-sky": {
      title: "Sky Garden",
      html:
        "<p>Landscaped terraces and a 360° view from 20 Fenchurch Street. Entry is free but you must book a time slot on the official site — sunset slots go quickly.</p>",
      photos: [
        {
          src: "images/sights/sky-garden.jpg",
          caption:
            "Sky Garden: planted terraces and viewing space inside 20 Fenchurch Street — free entry by advance booking only.",
        },
        {
          src: "images/sights/walkie-talkie.jpg",
          caption:
            "20 Fenchurch Street (“Walkie-Talkie”) — the Sky Garden occupies the top floors of this tower.",
        },
        {
          src: "images/sights/fenchurch-sunset.jpg",
          caption:
            "Sunset over the City — the terrace looks toward the Thames and Canary Wharf on a clear day.",
        },
      ],
      href: "pages/free-sights.html",
      guideHref: "guides/sky-garden.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5107,-0.0865",
    },
    "sight-tate": {
      title: "Tate Modern",
      html:
        "<p>International modern and contemporary art in a converted power station on Bankside. Entry to the collection is free; special exhibitions are ticketed. The Turbine Hall hosts large-scale installations — check what’s on before you visit.</p>",
      photos: [
        {
          src: "images/sights/tate-modern.jpg",
          caption:
            "The former Bankside Power Station — the Blavatnik Building and chimney are hard to miss from the Thames path.",
        },
        {
          src: "images/sights/tate-turbine.jpg",
          caption:
            "The Turbine Hall: dramatic space for big commissions and weekend crowds.",
        },
        {
          src: "images/shared/thames.jpg",
          caption:
            "South Bank and the Thames — easy to combine with a walk to Borough Market or the Southbank Centre.",
        },
      ],
      href: "pages/free-sights.html",
      guideHref: "guides/tate-modern.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5076,-0.0994",
    },
    "sight-natural-history": {
      title: "Natural History Museum",
      html:
        "<p>From dinosaurs in Hintze Hall to the Earth galleries, this South Kensington museum is free to enter (donations welcome). School holidays are packed — weekday openings are calmer. Book paid exhibitions online if you want guaranteed entry.</p>",
      photos: [
        {
          src: "images/sights/nh-facade.jpg",
          caption:
            "Romanesque terracotta façade on Cromwell Road — main visitor entrance.",
        },
        {
          src: "images/sights/nh-dippy.jpg",
          caption:
            "Hintze Hall with the blue whale skeleton suspended overhead.",
        },
        {
          src: "images/sights/nh-hintze.jpg",
          caption:
            "Arches and ceiling detail in Hintze Hall — worth looking up as you enter.",
        },
      ],
      href: "pages/free-sights.html",
      guideHref: "guides/natural-history-museum.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.4965,-0.1764",
    },
    "eat-borough": {
      title: "Borough Market",
      html:
        "<p>Independent traders under the arches — hot lunches, cheese, bread, and sweets. Tuesday–Thursday are calmer for browsing; Saturday is peak energy (and crowds).</p>",
      photos: [
        {
          src: "images/eats/borough-market.jpg",
          caption:
            "Borough Market near London Bridge — historic wholesale and retail food hall.",
        },
        {
          src: "images/eats/borough-cake.jpg",
          caption:
            "Sweet and bakery stalls under the railway arches — good for a treat between savoury stops.",
        },
        {
          src: "images/eats/borough-veg.jpg",
          caption:
            "Greengrocers and produce — compare prices as you loop the market on busy days.",
        },
      ],
      href: "pages/cheap-eats.html",
      guideHref: "guides/borough-market.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5055,-0.0910",
    },
    "eat-pizza": {
      title: "World food & street lunch",
      html:
        "<p>Interesting cheap lunches live on side streets: falafel and mezze, South Asian curry caffs, Vietnamese and Korean counters, Turkish grills, and salt-beef bagels. Set menus before mid-afternoon beat dinner prices; Asian supermarket hot counters are fast between museums.</p>",
      photos: [
        {
          src: "images/eats/falafel.jpg",
          caption:
            "Middle Eastern and Mediterranean takeaway counters — filling wraps and salads without sit-down surcharges.",
        },
        {
          src: "images/eats/chicken-curry.jpg",
          caption:
            "Curry houses and caffs often do lunch thalis or rice-and-three deals — check the board before you queue.",
        },
      ],
      href: "pages/cheap-eats.html",
      guideHref: "guides/world-eats.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5074,-0.1278",
    },
    "eat-coffee": {
      title: "Cafés & bakery mornings",
      html:
        "<p>Indie roasters and bakeries often do drink-plus-pastry for less than a hotel or chain brunch. A short queue of regulars is a better signal than the flashiest menu board.</p>",
      photos: [
        {
          src: "images/eats/latte.jpg",
          caption:
            "Latte or filter — morning queues of locals are usually a good sign for value.",
        },
        {
          src: "images/eats/coffee-beans.jpg",
          caption:
            "Bakeries and café counters with cakes and viennoiserie — a sweet add-on still often beats a full brunch bill.",
        },
      ],
      href: "pages/cheap-eats.html",
      guideHref: "guides/coffee-guide.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5074,-0.1278",
    },
    "eat-caff": {
      title: "Caffs & greasy spoons",
      html:
        "<p>Formica tables, toast racks, builder’s tea, and a full fry-up for less than a trendy brunch. Order at the counter, eat elbow-to-elbow with locals, and aim before 13:00 if you want a quieter table in small rooms.</p>",
      photos: [
        {
          src: "images/eats/english-breakfast.jpg",
          caption:
            "Full English on a hot plate — set breakfast bundles on the wall usually beat ordering every item separately.",
        },
        {
          src: "images/eats/full-english.jpg",
          caption:
            "Tea, toast, beans, and eggs: caff portions are generous; tap water is free if you ask politely.",
        },
      ],
      href: "pages/cheap-eats.html",
      guideHref: "pages/cheap-eats.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5242,-0.0774",
    },
    "eat-pub": {
      title: "Pub kitchens & daytime menus",
      html:
        "<p>Pubs double as cheap restaurants: lunch boards until mid-afternoon, curry clubs, pie night, and burger deals. Independent locals may chalk specials on a board; big rooms near stations are noisy but predictable on price. Check kitchen hours before you settle in — food can stop early outside busy zones.</p>",
      photos: [
        {
          src: "images/eats/fish-chips.jpg",
          caption:
            "Classic pub counter food — lunch pricing often switches to a smaller evening menu after 15:00–17:00.",
        },
        {
          src: "images/eats/pizza-plate.jpg",
          caption:
            "Burgers, pies, and grills fill the same boards — split a side of chips if you are saving.",
        },
      ],
      href: "pages/cheap-eats.html",
      guideHref: "pages/cheap-eats.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5131,-0.1043",
    },
    "eat-hall": {
      title: "Counter dining & food halls",
      html:
        "<p>Some of the best-value hot food sits in station arches and office atriums: buzzer queues, shared benches, and portions you can see before you pay — noodles, roti, sushi sets, or salad boxes often land £7–11 with no booking charge.</p>",
      photos: [
        {
          src: "images/eats/borough-market.jpg",
          caption:
            "Covered markets and food halls — many stalls do one hot dish to take away or eat on shared benches.",
        },
        {
          src: "images/eats/borough-veg.jpg",
          caption:
            "Greengrocer and deli counters alongside hot food — mix a small savoury plate with bread from another trader.",
        },
      ],
      href: "pages/cheap-eats.html",
      guideHref: "guides/borough-market.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5055,-0.0910",
    },
    "trans-bus": {
      title: "Buses & Hopper fare",
      html:
        "<p>London buses charge a <strong>flat fare</strong> per ride in the capital’s bus and tram area — tap your Oyster or contactless once when you board (no touch off). The <strong>Hopper</strong> gives unlimited further bus and tram journeys within <strong>one hour</strong> of your first tap at no extra cost, perfect for zig-zagging to museums or markets.</p>",
      photos: [
        {
          src: "images/transport/bus-routemaster.jpg",
          caption:
            "New Routemaster and other TfL buses — use the middle or rear doors where signs allow, and tap the yellow reader by the pole.",
        },
        {
          src: "images/transport/bus-hopper.jpg",
          caption:
            "When a short central hop crosses zones on the Tube, compare a single bus ride on a journey planner — sometimes cheaper and more scenic.",
        },
      ],
      href: "pages/transport.html",
      guideHref: "pages/transport.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5074,-0.1278",
    },
    "trans-tube": {
      title: "Tube, zones & touching out",
      html:
        "<p>Underground, DLR, Elizabeth line (within London), and most National Rail inside the TfL map use <strong>distance and zones</strong> to price journeys. Always <strong>touch in and out</strong> on the yellow readers — if you exit through an open gate without tapping, you risk a maximum fare until the record is fixed. Peak weekday times cost more on many singles; check TfL’s table for exact bands.</p>",
      photos: [
        {
          src: "images/transport/new-tube-entrance.jpg",
          caption:
            "Deep-level Tube lines — step-free access varies; allow extra time for lifts at busy interchanges.",
        },
      ],
      href: "pages/transport.html",
      guideHref: "pages/transport.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5074,-0.1278",
    },
    "trans-oyster": {
      title: "Oyster card",
      html:
        "<p>Buy a blue <strong>Oyster</strong> at airports, stations, and many shops, then top up with cash or card at machines. Pay-as-you-go balances follow the <strong>same fares and daily caps</strong> as contactless. Useful if you want one card for the family, fewer foreign-card taps, or to load an eligible <strong>Railcard discount</strong> for cheaper off-peak National Rail — link the Railcard at a ticket machine following TfL’s instructions.</p>",
      photos: [
        {
          src: "images/transport/new-oyster-reader.jpg",
          caption:
            "Yellow Oyster/contactless reader at ticket gates — tap flat and wait for confirmation beep.",
        },
        {
          src: "images/transport/new-tube-entrance.jpg",
          caption:
            "Tube station entrance — Oyster works across most TfL rail and bus journeys from the same balance.",
        },
      ],
      href: "pages/transport.html",
      guideHref: "pages/transport.html",
      mapHref:
        "https://www.google.com/maps/dir/?api=1&destination=51.5074,-0.1278",
    },
  };

  function initThemeToggle() {
    var root = document.documentElement;
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    function sync() {
      var isLight = root.getAttribute("data-theme") === "light";
      btn.setAttribute("aria-pressed", isLight ? "true" : "false");
      btn.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
      );
      btn.title = isLight ? "Dark theme" : "Light theme";
    }
    btn.addEventListener("click", function () {
      var isLight = root.getAttribute("data-theme") === "light";
      if (isLight) {
        root.removeAttribute("data-theme");
        document.cookie =
          "london_guide_theme=dark;path=/;max-age=31536000;SameSite=Lax";
      } else {
        root.setAttribute("data-theme", "light");
        document.cookie =
          "london_guide_theme=light;path=/;max-age=31536000;SameSite=Lax";
      }
      sync();
    });
    sync();
  }

  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    function applyScroll(y) {
      header.classList.toggle("is-scrolled", y > 32);
    }
    if (lenisRef && typeof lenisRef.on === "function") {
      lenisRef.on("scroll", function () {
        applyScroll(lenisRef.scroll || 0);
      });
      applyScroll(lenisRef.scroll || 0);
    } else {
      function onWinScroll() {
        applyScroll(window.scrollY || document.documentElement.scrollTop);
      }
      window.addEventListener("scroll", onWinScroll, { passive: true });
      onWinScroll();
    }
  }

  function ensurePlaceModal() {
    if (document.getElementById("place-modal")) return;
    var root = document.createElement("div");
    root.id = "place-modal";
    root.className = "place-modal";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML =
      '<div class="place-modal__backdrop" data-place-modal-close tabindex="-1"></div>' +
      '<div class="place-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="place-modal-title">' +
      '<button type="button" class="place-modal__close" aria-label="Close dialog">&times;</button>' +
      '<h2 class="place-modal__title" id="place-modal-title"></h2>' +
      '<div class="place-modal__viewer">' +
      '<button type="button" class="place-modal__nav place-modal__nav--prev" aria-label="Previous photo">&#10094;</button>' +
      '<figure class="place-modal__main"><img class="place-modal__main-img" src="" alt="" /></figure>' +
      '<button type="button" class="place-modal__nav place-modal__nav--next" aria-label="Next photo">&#10095;</button>' +
      "</div>" +
      '<div class="place-modal__meta"><span class="place-modal__counter" aria-live="polite"></span></div>' +
      '<p class="place-modal__photo-caption" aria-live="polite"></p>' +
      '<div class="place-modal__gallery" role="list"></div>' +
      '<div class="place-modal__text"></div>' +
      '<div class="place-modal__actions">' +
      '<a class="place-modal__link btn" href="#">Open full guide</a>' +
      '<a class="place-modal__map btn" href="#" target="_blank" rel="noopener noreferrer">Navigate in Google Maps</a>' +
      "</div>" +
      "</div>";
    document.body.appendChild(root);
  }

  function initPlaceModal() {
    ensurePlaceModal();
    var modal = document.getElementById("place-modal");
    if (!modal) return;
    var titleEl = modal.querySelector(".place-modal__title");
    var galleryEl = modal.querySelector(".place-modal__gallery");
    var mainImgEl = modal.querySelector(".place-modal__main-img");
    var counterEl = modal.querySelector(".place-modal__counter");
    var captionPhotoEl = modal.querySelector(".place-modal__photo-caption");
    var prevBtn = modal.querySelector(".place-modal__nav--prev");
    var nextBtn = modal.querySelector(".place-modal__nav--next");
    var textEl = modal.querySelector(".place-modal__text");
    var linkEl = modal.querySelector(".place-modal__link");
    var mapEl = modal.querySelector(".place-modal__map");
    var closeBtn = modal.querySelector(".place-modal__close");
    var backdrop = modal.querySelector(".place-modal__backdrop");
    var activePhotoEntries = [];
    var activeIndex = 0;
    var lastTrigger = null;

    function updateMainPhoto(index) {
      if (!activePhotoEntries.length) return;
      activeIndex = (index + activePhotoEntries.length) % activePhotoEntries.length;
      var cur = activePhotoEntries[activeIndex];
      mainImgEl.removeAttribute("data-fallback-bound");
      mainImgEl.removeAttribute("data-imgTry");
      mainImgEl.src = resolveAssetSrc(cur.src);
      mainImgEl.alt = titleEl.textContent + " — photo " + (activeIndex + 1);
      attachImageFallback(mainImgEl);
      if (captionPhotoEl) {
        captionPhotoEl.textContent = cur.caption || "";
      }
      counterEl.textContent = activeIndex + 1 + " / " + activePhotoEntries.length;
      galleryEl.querySelectorAll(".place-modal__thumb").forEach(function (btn, i) {
        btn.classList.toggle("is-active", i === activeIndex);
        btn.setAttribute("aria-current", i === activeIndex ? "true" : "false");
      });
    }

    function openModal(key) {
      var data = PLACE_DATA[key];
      if (!data) return;
      titleEl.textContent = data.title;
      textEl.innerHTML = data.html;
      linkEl.href = resolveSiteHref(data.guideHref || data.href);
      linkEl.textContent = "Open full guide";
      linkEl.setAttribute("target", "_blank");
      linkEl.setAttribute("rel", "noopener noreferrer");
      if (data.mapHref) {
        mapEl.href = data.mapHref;
        mapEl.hidden = false;
      } else {
        mapEl.hidden = true;
        mapEl.removeAttribute("href");
      }
      galleryEl.innerHTML = "";
      activePhotoEntries = (data.photos || []).map(normalizePhoto);
      if (!activePhotoEntries.length) return;
      activePhotoEntries.forEach(function (entry, i) {
        var fig = document.createElement("button");
        fig.type = "button";
        fig.className = "place-modal__thumb";
        fig.setAttribute("aria-label", "Photo " + (i + 1));
        fig.setAttribute("role", "listitem");
        var img = document.createElement("img");
        img.src = resolveAssetSrc(entry.src);
        img.alt = data.title + " photo " + (i + 1);
        img.loading = "lazy";
        attachImageFallback(img);
        fig.appendChild(img);
        fig.addEventListener("click", function () {
          updateMainPhoto(i);
        });
        galleryEl.appendChild(fig);
      });
      updateMainPhoto(0);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
      if (typeof gsap !== "undefined" && !prefersReducedMotion) {
        gsap.fromTo(
          modal.querySelector(".place-modal__dialog"),
          { opacity: 0, y: 24, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" }
        );
      }
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus();
      }
    }

    function onTrigger(el) {
      var key = el.getAttribute("data-place-modal");
      if (!key || !PLACE_DATA[key]) return;
      lastTrigger = el;
      openModal(key);
    }

    document.querySelectorAll("[data-place-modal]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        onTrigger(el);
      });
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTrigger(el);
        }
      });
    });

    function bindClose(node) {
      if (!node) return;
      node.addEventListener("click", function () {
        closeModal();
      });
    }
    bindClose(closeBtn);
    bindClose(backdrop);
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        updateMainPhoto(activeIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        updateMainPhoto(activeIndex + 1);
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
        return;
      }
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        updateMainPhoto(activeIndex - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        updateMainPhoto(activeIndex + 1);
      }
    });
  }

  function initImageFallbacks() {
    document.querySelectorAll("img").forEach(function (img) {
      attachImageFallback(img);
    });
  }

  function initPageTransitions() {
    if (prefersReducedMotion) return;

    var root = document.documentElement;
    if (!root.classList.contains("pt")) {
      root.classList.add("pt");
    }

    function showPage() {
      root.classList.add("pt--in");
    }

    requestAnimationFrame(function () {
      requestAnimationFrame(showPage);
    });

    function isInternalHtmlLink(anchor) {
      if (
        anchor.target === "_blank" ||
        anchor.hasAttribute("download") ||
        anchor.getAttribute("href") === null
      ) {
        return false;
      }
      var raw = anchor.getAttribute("href");
      if (!raw || raw.indexOf("#") === 0) return false;
      try {
        var u = new URL(anchor.href, window.location.href);
        if (u.origin !== window.location.origin) return false;
        return /\.html$/i.test(u.pathname);
      } catch (e) {
        return false;
      }
    }

    function navigateTo(href) {
      window.location.href = href;
    }

    document.addEventListener(
      "click",
      function (e) {
        if (e.defaultPrevented) return;
        if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey) return;
        var a = e.target.closest && e.target.closest("a");
        if (!a || !isInternalHtmlLink(a)) return;
        if (a.href === window.location.href) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        var href = a.href;
        root.classList.remove("pt--in");
        root.classList.add("pt--out");

        var done = false;
        function go() {
          if (done) return;
          done = true;
          navigateTo(href);
        }

        function onTE(ev) {
          if (ev.target !== document.body || ev.propertyName !== "opacity") {
            return;
          }
          document.body.removeEventListener("transitionend", onTE);
          go();
        }

        document.body.addEventListener("transitionend", onTE);
        window.setTimeout(go, PAGE_OUT_MS);
      },
      false
    );
  }

  function initLenis() {
    if (typeof Lenis === "undefined") return null;
    var lenis = new Lenis({
      duration: 1.45,
      easing: function (t) {
        return 1 - Math.pow(1 - t, 3);
      },
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
    });

    lenis.on("scroll", function () {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.update();
      }
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenisRef = lenis;
    return lenis;
  }

  function smoothScrollToTop() {
    var dur = prefersReducedMotion ? 0 : 2.45;
    var ease = function (t) {
      return 1 - Math.pow(1 - t, 4);
    };
    if (lenisRef && typeof lenisRef.scrollTo === "function") {
      try {
        lenisRef.scrollTo(0, {
          duration: dur,
          easing: ease,
        });
      } catch (e) {
        lenisRef.scrollTo(0, { duration: dur });
      }
    } else {
      if (prefersReducedMotion) {
        window.scrollTo(0, 0);
        return;
      }
      var start = window.scrollY || document.documentElement.scrollTop;
      if (start <= 0) return;
      var startTime = null;
      function step(ts) {
        if (startTime === null) startTime = ts;
        var p = Math.min((ts - startTime) / (dur * 1000), 1);
        var t = ease(p);
        window.scrollTo(0, start * (1 - t));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
  }

  function initBackToTop() {
    var btn = document.querySelector(".back-to-top");
    if (!btn) return;
    btn.addEventListener("click", function () {
      smoothScrollToTop();
    });
  }

  function initNavPanel() {
    var panel = document.getElementById("nav-panel");
    var header = document.querySelector(".site-header");
    var triggers = document.querySelectorAll("button.btn-navigation");
    var toggle = document.querySelector(".nav-toggle");
    if (!panel || !header) return;

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      triggers.forEach(function (b) {
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
      if (toggle) {
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      }
      header.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    function togglePanel() {
      setOpen(!panel.classList.contains("is-open"));
    }

    triggers.forEach(function (btnNav) {
      btnNav.addEventListener("click", function (e) {
        e.stopPropagation();
        togglePanel();
      });
    });

    if (toggle) {
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        togglePanel();
      });
    }

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("click", function (e) {
      if (!panel.classList.contains("is-open")) return;
      if (e.target.closest(".btn-navigation")) return;
      if (e.target.closest(".nav-toggle")) return;
      if (panel.contains(e.target)) return;
      setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var pm = document.getElementById("place-modal");
      if (pm && pm.classList.contains("is-open")) return;
      setOpen(false);
    });
  }

  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      document.querySelectorAll(".fade").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var heroLines = document.querySelectorAll(
      ".hero__content h1, .hero__content .lead"
    );
    if (heroLines.length) {
      gsap.from(heroLines, {
        opacity: 0,
        y: 18,
        duration: 1.15,
        stagger: 0.16,
        ease: "power3.out",
        delay: 0.08,
      });
    }

    gsap.utils.toArray(".fade").forEach(function (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: prefersReducedMotion ? 0 : 1.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=56px",
            toggleActions: "play none none none",
          },
        }
      );
    });

    gsap.utils.toArray(".hero__media img").forEach(function (img) {
      if (prefersReducedMotion) return;
      gsap.to(img, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: img.closest(".hero"),
          start: "top top",
          end: "bottom top",
          scrub: 1.15,
        },
      });
    });

    ScrollTrigger.refresh();
  }

  function initRolloverCards() {
    if (prefersReducedMotion || typeof gsap === "undefined") return;
    document.querySelectorAll(".rollover-card[data-rollover]").forEach(function (
      card
    ) {
      var img = card.querySelector("img");
      if (!img) return;
      card.addEventListener("mouseenter", function () {
        gsap.to(img, { scale: 1.07, duration: 0.55, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(img, { scale: 1, duration: 0.65, ease: "power2.out" });
      });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("form-status");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");

      if (!name || !email || !message) return;

      var nameVal = name.value.trim();
      var emailVal = email.value.trim();
      var msgVal = message.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);

      if (!status) return;
      status.classList.remove(
        "is-visible",
        "form-status--ok",
        "form-status--err"
      );

      if (!nameVal || !emailVal || !msgVal) {
        status.textContent = "Please fill in every field.";
        status.classList.add("is-visible", "form-status--err");
        return;
      }

      if (!emailOk) {
        status.textContent = "Please enter a valid email address.";
        status.classList.add("is-visible", "form-status--err");
        return;
      }

      status.textContent =
        "Thanks — your message is recorded (demo only: nothing is sent to a server).";
      status.classList.add("is-visible", "form-status--ok");
      form.reset();
    });
  }

  function boot() {
    initThemeToggle();
    initImageFallbacks();
    initPageTransitions();
    initNavPanel();
    initPlaceModal();
    initContactForm();

    if (prefersReducedMotion) {
      document.querySelectorAll(".fade").forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      initHeaderScroll();
      initBackToTop();
      initRolloverCards();
      return;
    }

    initLenis();
    initHeaderScroll();
    initBackToTop();
    initScrollAnimations();
    initRolloverCards();

    window.addEventListener(
      "resize",
      function () {
        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      },
      { passive: true }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
