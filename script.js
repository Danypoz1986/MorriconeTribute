$(document).ready(function () {
  let currentHall = 0;
  const halls = $(".hall");
  const totalHalls = halls.length;
  const leftArrow = $("#prev");
  const rightArrow = $("#next");
  let videoData = [];
  const overlay = $("<div id='black-overlay'></div>");
  $("body").append(overlay);

  // Style the black overlay with CSS
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

  const countdownVideoSrc = "https://storage.googleapis.com/p3videos/Old%20Movie%20Countdown%20%E2%80%93%20Counting%20Down%20Clock.mp4";

  console.log("Document ready. Total halls:", totalHalls);

  // Fetch video data
  $.ajax({
    url: "https://storage.googleapis.com/p3videos/videos.json?nocache=" + new Date().getTime(),
    method: "GET",
    dataType: "json",
    success: function (data) {
      videoData = data.videos;
      console.log("Video data loaded successfully:", videoData);
      initializeHalls();
    },
    error: function () {
      console.error("Failed to load video data.");
    },
  });

  function initializeHalls() {
    console.log("Initializing halls...");
    halls.each(function (index) {
      const hall = $(this);
      const countdownVideo = hall.find(".countdown-video");
      const mainVideo = hall.find(".main-video");
  
      if (videoData[index]) {
        const hallData = videoData[index];
        countdownVideo.attr("src", countdownVideoSrc); // Set the countdown video source
        mainVideo.attr("src", hallData.url); // Set the main video source
  
        console.log(`Hall ${index + 1} initialized with video URL: ${hallData.url}`);
  
        // Add hover effect for controls
        mainVideo.hover(
          function () {
            $(this).attr("controls", "true"); // Show controls on hover
          },
          function () {
            $(this).removeAttr("controls"); // Hide controls when not hovering
          }
        );
      } else {
        console.error(`No video data for Hall ${index + 1}`);
      }
    });
  
    console.log("Halls initialized.");
    $(".hall").hide(); // Hide all halls initially
    const firstHall = $(`#halls .hall:nth-child(${currentHall + 1})`);
    firstHall.show(); // Directly show the first hall
    playMovie(firstHall); // Play the movie in the first hall
  
    updateArrowVisibility(); // Update arrow visibility for the first hall
  }
  


  // Reset all videos
  function resetAllVideos() {
    console.log("Resetting all videos...");
    $("video").each(function () {
      this.pause();
      this.currentTime = 0;
      $(this).hide(); // Hide all videos initially
      $(this).removeAttr("controls"); // Ensure controls are hidden
    });
  }

  function playMovie(hallElement) {
    const countdownVideo = hallElement.find(".countdown-video").get(0);
    const mainVideo = hallElement.find(".main-video").get(0);
    const detailsContainer = hallElement.find(".details"); // Select the .details element

    console.log("Playing movie for hall:", hallElement);

    resetAllVideos();
    detailsContainer.hide(); // Always hide the title container initially

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

                        // Display the title in the details section for the main video
                        const hallIndex = hallElement.index();
                        if (videoData[hallIndex]) {
                            const title = videoData[hallIndex].title;
                            detailsContainer.html(`<h2>HALL ${hallIndex + 1}: ${title}</h2>`); // Dynamically add title
                            detailsContainer.fadeIn(1000); // Show the details container
                        }

                        // Flag to track if the video was playing
                        let wasPlaying = !mainVideo.paused;

                        // Monitor header height and pause/resume video
                        const headerObserver = new ResizeObserver(() => {
                            const headerHeight = $("header").outerHeight();
                            console.log(`Header height: ${headerHeight}px`);

                            if (headerHeight > 100) {
                                if (!mainVideo.paused) {
                                    wasPlaying = true; // Remember that the video was playing
                                    console.log("Header height exceeded 100px. Pausing video.");
                                    mainVideo.pause();
                                }
                            } else {
                                if (wasPlaying) {
                                    console.log("Header height is 100px or less. Resuming video.");
                                    mainVideo.play();
                                    wasPlaying = false; // Reset the flag after resuming
                                }
                            }
                        });

                        // Observe the header element
                        headerObserver.observe($("header")[0]);

                        // Stop observing when the video ends
                        mainVideo.onended = function () {
                            headerObserver.disconnect();
                            console.log("Main video ended. Stopped observing header.");
                            detailsContainer.fadeOut(1000); // Hide the details container when the main video ends
                        };
                    });
                });
            };
        });
    } else if (mainVideo) {
        console.log("Playing main video directly...");
        $(mainVideo).show().fadeIn(500, function () {
            mainVideo.play();
            console.log("Main video playing.");

            // Display the title in the details section for the main video
            const hallIndex = hallElement.index();
            if (videoData[hallIndex]) {
                const title = videoData[hallIndex].title;
                detailsContainer.html(`<h2>${title}</h2>`); // Dynamically add title
                detailsContainer.fadeIn(1000); // Show the details container
            }

            // Flag to track if the video was playing
            let wasPlaying = !mainVideo.paused;

            // Monitor header height and pause/resume video
            const headerObserver = new ResizeObserver(() => {
                const headerHeight = $("header").outerHeight();
                console.log(`Header height: ${headerHeight}px`);

                if (headerHeight > 100) {
                    if (!mainVideo.paused) {
                        wasPlaying = true; // Remember that the video was playing
                        console.log("Header height exceeded 100px. Pausing video.");
                        mainVideo.pause();
                    }
                } else {
                    if (wasPlaying) {
                        console.log("Header height is 100px or less. Resuming video.");
                        mainVideo.play();
                        wasPlaying = false; // Reset the flag after resuming
                    }
                }
            });

            // Observe the header element
            headerObserver.observe($("header")[0]);

            // Stop observing when the video ends
            mainVideo.onended = function () {
                headerObserver.disconnect();
                console.log("Main video ended. Stopped observing header.");
                detailsContainer.fadeOut(1000); // Hide the details container when the main video ends
            };
        });
    } else {
        console.error("No videos found in the current hall!");
        detailsContainer.hide(); // Ensure title is hidden if no main video exists
    }
}


function updateHall(hallIndex) {
  const currentHallElement = $(`#halls .hall:nth-child(${hallIndex + 1})`);

  // Show the black overlay and fade in
  $("#black-overlay").fadeIn(1000, function () {
      $(".hall").hide(); // Hide all halls
      currentHallElement.show(); // Show the selected hall

      // Fade out the black overlay after showing the new hall
      $("#black-overlay").fadeOut(1000, function () {
          playMovie(currentHallElement); // Play the current hall's video
      });
  });

  updateArrowVisibility(); // Update arrow visibility after changing halls
}


  // Update arrow visibility
  function updateArrowVisibility() {
    // Ensure arrows are shown/hidden based on the current hall
    if (currentHall === 0) {
      leftArrow.hide(); // Hide left arrow on the first page
    } else {
      leftArrow.show(); // Show left arrow otherwise
    }

    if (currentHall === totalHalls - 1) {
      rightArrow.hide(); // Hide right arrow on the last page
    } else {
      rightArrow.show(); // Show right arrow otherwise
    }
  }

  // Navigation controls
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

  // Navigation via links
  $("a[href^='#hall-']").click(function (e) {
    e.preventDefault();
    const hallId = $(this).attr("href").replace("#hall-", "");
    const hallIndex = parseInt(hallId) - 1;
    console.log("Hall link clicked. Navigating to Hall:", hallIndex + 1);
    currentHall = hallIndex;
    updateHall(currentHall);
  });
});

const monitorBackground = () => {
  const headerHeight = $("header").outerHeight(); // Get header height using jQuery
  console.log("Header height:", headerHeight); // Debugging

  if (headerHeight <= 100) {
    // Header is small, adjust background height
    $(".cinema-background").css({
      height: "calc(100vh - 50px)", // Adjust height
      backgroundPosition: "center top", // Ensure alignment
    });
  } else if (headerHeight > 500) {
    // Header is large, adjust background height
    $(".cinema-background").css({
      height: "100vh", // Full height
      backgroundPosition: "center top", // Center alignment
    });
  }
};

// Call the function initially
monitorBackground();

// Dynamically monitor header height every 50ms
setInterval(monitorBackground, 50);
