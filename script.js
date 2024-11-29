$(document).ready(function () {
  let currentHall = 0; // Nykyisen hallin indeksi
  const halls = $(".hall"); // Haetaan kaikki hall-elementit
  const totalHalls = halls.length; // Hallien kokonaismäärä
  const leftArrow = $("#prev"); // Edellinen-painike
  const rightArrow = $("#next"); // Seuraava-painike
  let videoData = []; // Videotiedot
  const overlay = $("<div id='black-overlay'></div>"); // Musta peittokuva
  $("body").append(overlay); // Lisätään peittokuva body-elementtiin

  // Asetetaan mustan peittokuvan CSS-tyylit
  $("#black-overlay").css({
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    zIndex: "1000",
    display: "none",
  });

  const countdownVideoSrc = "https://storage.googleapis.com/p3videos/Old%20Movie%20Countdown%20%E2%80%93%20Counting%20Down%20Clock.mp4"; // Laskentavideon lähde

  console.log("Document ready. Total halls:", totalHalls);

  // Haetaan videotiedot JSON-tiedostosta
  $.ajax({
    url: "https://storage.googleapis.com/p3videos/videos.json?nocache=" + new Date().getTime(),
    method: "GET",
    dataType: "json",
    success: function (data) {
      videoData = data.videos; // Tallennetaan videotiedot
      console.log("Video data loaded successfully:", videoData);
      initializeHalls(); // Alustetaan hallit
    },
    error: function () {
      console.error("Failed to load video data."); // Virheilmoitus
    },
  });

  function initializeHalls() {
    console.log("Initializing halls...");
    halls.each(function (index) {
      const hall = $(this); // Yksittäinen hall-elementti
      const countdownVideo = hall.find(".countdown-video"); // Laskentavideo
      const mainVideo = hall.find(".main-video"); // Päävideo

      if (videoData[index]) {
        const hallData = videoData[index]; // Hallin tiedot
        countdownVideo.attr("src", countdownVideoSrc); // Asetetaan laskentavideon lähde
        mainVideo.attr("src", hallData.url); // Asetetaan päävideon lähde

        console.log(`Hall ${index + 1} initialized with video URL: ${hallData.url}`);

        // Lisätään hover-efekti videon kontrollien näyttämiseksi
        mainVideo.hover(
          function () {
            $(this).attr("controls", "true"); // Näytetään kontrollit hover-tilassa
          },
          function () {
            $(this).removeAttr("controls"); // Piilotetaan kontrollit, kun ei hover-tilassa
          }
        );
      } else {
        console.error(`No video data for Hall ${index + 1}`); // Virheilmoitus puuttuvasta videosta
      }
    });

    console.log("Halls initialized.");
    $(".hall").hide(); // Piilotetaan kaikki hallit aluksi
    const firstHall = $(`#halls .hall:nth-child(${currentHall + 1})`);
    firstHall.show(); // Näytetään ensimmäinen halli
    playMovie(firstHall); // Toistetaan ensimmäisen hallin video

    updateArrowVisibility(); // Päivitetään nuolien näkyvyys
  }

  // Nollaa kaikkien videoiden tila
  function resetAllVideos() {
    console.log("Resetting all videos...");
    $("video").each(function () {
      this.pause(); // Pysäytä video
      this.currentTime = 0; // Nollaa toistoaika
      $(this).hide(); // Piilota video
      $(this).removeAttr("controls"); // Piilota kontrollit
    });
  }

  function playMovie(hallElement) {
    const countdownVideo = hallElement.find(".countdown-video").get(0); // Laskentavideo
    const mainVideo = hallElement.find(".main-video").get(0); // Päävideo
    const detailsContainer = hallElement.find(".details"); // Videon otsikkoalue

    console.log("Playing movie for hall:", hallElement);

    resetAllVideos(); // Nollataan kaikki videot
    detailsContainer.hide(); // Piilotetaan otsikkoalue aluksi

    if (countdownVideo && mainVideo) {
      console.log("Playing countdown video...");
      $(countdownVideo).show().fadeIn(500, function () {
        countdownVideo.play();
        countdownVideo.onended = function () {
          console.log("Countdown video ended, switching to main video...");
          $(countdownVideo).fadeOut(500, function () {
            $(mainVideo).show().fadeIn(500, function () {
              mainVideo.play();
              console.log("Main video playing.");

              // Näytetään videon otsikko
              const hallIndex = hallElement.index();
              if (videoData[hallIndex]) {
                const title = videoData[hallIndex].title;
                detailsContainer.html(`<h2>HALL ${hallIndex + 1}: ${title}</h2>`); // Dynaaminen otsikko
                detailsContainer.fadeIn(1000); // Näytetään otsikko
              }

              let wasPlaying = !mainVideo.paused; // Seurataan videon tilaa

              // Tarkkaillaan header-elementin korkeutta
              const headerObserver = new ResizeObserver(() => {
                const headerHeight = $("header").outerHeight();
                console.log(`Header height: ${headerHeight}px`);

                if (headerHeight > 100) {
                  if (!mainVideo.paused) {
                    wasPlaying = true; // Tallennetaan toistotila
                    console.log("Header height exceeded 100px. Pausing video.");
                    mainVideo.pause();
                  }
                } else {
                  if (wasPlaying) {
                    console.log("Header height is 100px or less. Resuming video.");
                    mainVideo.play();
                    wasPlaying = false; // Nollataan toistotila
                  }
                }
              });

              headerObserver.observe($("header")[0]); // Tarkkailu alkaa

              mainVideo.onended = function () {
                headerObserver.disconnect(); // Lopetetaan tarkkailu
                console.log("Main video ended. Stopped observing header.");
                detailsContainer.fadeOut(1000); // Piilotetaan otsikko
              };
            });
          });
        };
      });
    } else {
      console.error("No videos found in the current hall!");
      detailsContainer.hide(); // Varmistetaan, että otsikko piilotetaan
    }
  }

  function updateHall(hallIndex) {
    const currentHallElement = $(`#halls .hall:nth-child(${hallIndex + 1})`);

    $(".details").hide(); // Piilotetaan otsikko ennen siirtymää

    $("#black-overlay").fadeIn(1000, function () {
      $(".hall").hide(); // Piilotetaan kaikki hallit
      currentHallElement.show(); // Näytetään valittu halli

      $("#black-overlay").fadeOut(1000, function () {
        playMovie(currentHallElement); // Toistetaan valitun hallin video
      });
    });

    updateArrowVisibility(); // Päivitetään nuolien näkyvyys
  }

  // Päivitä nuolien näkyvyys
  function updateArrowVisibility() {
    if (currentHall === 0) {
      leftArrow.hide(); // Piilotetaan vasen nuoli ensimmäisessä hallissa
    } else {
      leftArrow.show(); // Näytetään vasen nuoli
    }

    if (currentHall === totalHalls - 1) {
      rightArrow.hide(); // Piilotetaan oikea nuoli viimeisessä hallissa
    } else {
      rightArrow.show(); // Näytetään oikea nuoli
    }
  }

  // Navigointipainikkeet
  rightArrow.click(function () {
    if (currentHall < totalHalls - 1) {
      currentHall++;
      console.log("Next button clicked. Current hall:", currentHall + 1);
      updateHall(currentHall);
    } else {
      console.log("Already at the last hall.");
    }
  });

  leftArrow.click(function () {
    if (currentHall > 0) {
      currentHall--;
      console.log("Previous button clicked. Current hall:", currentHall + 1);
      updateHall(currentHall);
    } else {
      console.log("Already at the first hall.");
    }
  });

  // Navigointi linkkien kautta
  $("a[href^='#hall-']").click(function (e) {
    e.preventDefault();
    const hallId = $(this).attr("href").replace("#hall-", "");
    const hallIndex = parseInt(hallId) - 1;
    console.log("Hall link clicked. Navigating to Hall:", hallIndex + 1);
    currentHall = hallIndex;
    updateHall(currentHall);
  });
});

// Tarkkailee headerin korkeutta ja päivittää taustakuvan asetukset
const monitorBackground = () => {
  const headerHeight = $("header").outerHeight();
  console.log("Header height:", headerHeight);

  if (headerHeight <= 100) {
    $(".cinema-background").css({
      height: "calc(100vh - 50px)",
      backgroundPosition: "center top",
    });
  } else if (headerHeight > 500) {
    $(".cinema-background").css({
      height: "100vh",
      backgroundPosition: "center top",
    });
  }
};

// Alustetaan taustakuvan tarkkailu
monitorBackground();
setInterval(monitorBackground, 50); // Tarkkailu 50ms välein