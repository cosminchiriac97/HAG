<<<<<<< HEAD
var temp;
var extractedJson = [];

chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action.indexOf("export") !== -1) {
    if (request.action.indexOf("JSON") !== -1) {
      download(request.source, request.action + ".json", "json");
    } else
      download(request.source, request.action + ".html", "html");
  } else {
    var x = request.source;
    for (var i = 0; i < x.length; i++) {
      var p = x[i];
      extractedJson[extractedJson.length] = Object.assign({}, x[i]);
      var section = document.createElement("BUTTON");
      section.addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
      var sectionName = document.createTextNode(p['@type'] + '(' + request.action + ')');
      delete p['@context'];
      delete p['@type'];
      section.appendChild(sectionName);
      section.className = "accordion";
      getTableFormat();
      traverse(0, p, process);
      var panel = temp;
      document.getElementById("Home").appendChild(section);
      document.getElementById("Home").appendChild(panel);
    }
  }
});

function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function process(key, value, level) {
  var tr = document.createElement("tr");
  var cell1 = document.createElement("td");
  var cell2 = document.createElement("td");
  cell1.textContent = key;
  cell2.textContent = value;
  tr.appendChild(cell1);
  tr.appendChild(cell2);
  if (value == '') {
    level++;
    cell1.textContent = cell1.textContent.toUpperCase();
    cell1.style.background = getColorByLevel(level);
    cell2.style.background = getColorByLevel(level);
    cell1.style.paddingLeft = (level * 15 + 5) + 'px';
    temp.appendChild(tr);
  }
  else {
    cell1.style.background = getColorByLevel(level);
    cell2.style.background = getColorByLevel(level);
    cell1.style.paddingLeft = (level * 15 + 5) + 'px';
    if (ValidIMGURL(value)) {
      var img = document.createElement('img');
      img.src = value;
      img.style.width = "100%";
      img.style.height = "100%";
      cell2.textContent = '';
      cell2.appendChild(img);
      temp.appendChild(tr);
    } else if (ValidURL(value)) {
      var a = document.createElement('a');
      a.href = value;
      cell2.textContent = '';
      a.textContent = "CTRL + Click Here!";
      cell2.appendChild(a);
      temp.appendChild(tr);
    }
    else {
      temp.appendChild(tr);
=======


chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSchemas") {
      message.insertAdjacentHTML("beforeend", "<pre>" + JSON.stringify(request.source, null, 2) + "<pre>");
>>>>>>> d9e093a9b33f523d3b3520a58b5d927013215d3b
    }
  }
}

function traverse(level, o, func) {
  for (var i in o) {
    if (o[i] !== null && typeof (o[i]) != "object") {
      func.apply(this, [i, o[i], level]);
    }
    if (typeof (o[i]) == "object") {
      func.apply(this, [i, '', level]);
    }
    if (o[i] !== null && typeof (o[i]) == "object") {
      traverse(level + 1, o[i], func);
    }
  }
}

function ValidURL(str) {
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  if (!regex.test(str)) {
    return false;
  } else {
    return true;
  }
}
function ValidIMGURL(url) {
  var expression = /\.(jpg|gif|png)$/gi;
  var regex = new RegExp(expression);
  if (!regex.test(url)) {
    return false;
  } else {
    return true;
  }
}

function getTableFormat() {
  temp = document.createElement("table");
  temp.className = "panel details";
  var tr = document.createElement("tr");
  var header = document.createElement("th");
  var thead = document.createTextNode("Attribute");
  header.appendChild(thead);
  tr.appendChild(header);
  header = document.createElement("th");
  thead = document.createTextNode("Value");
  header.appendChild(thead);
  tr.appendChild(header);
  temp.appendChild(tr);
}

function onWindowLoad() {
  var currFormats = [];
  var currTypes = [];

  chrome.storage.sync.get("currFilters", function (result) {
    currTypes = Types;
    if (result.currFilters) {
      currTypes = result.currFilters;
      updateFilters();
    }
    chrome.storage.sync.get("currFormats", function (result) {
      if (result.currFormats) {
        currFormats = result.currFormats;
        updateFormats();
      }
      start();
    });
  });
<<<<<<< HEAD

  eventListeners();

  function updateFormats() {
    formats = document.getElementsByName("format");
    for (i = 0; i < formats.length; i++) {
      for (j = 0; j < currFormats.length; j++) {
        if (formats[i].id == currFormats[j]) {
          formats[i].checked = true;
        }
      }
    }
  }

  function updateFilters() {
    var custom;
    document.getElementById("currFilters").innerHTML = '';
    if (currTypes.length > 0) {
      document.getElementById("currFilters").innerHTML = ' ' + currTypes[0];
      for (var j = 1; j < currTypes.length; j++) {
        custom = ' (custom)';
        for (var i = 0; i < Types.length; i++) {
          if (currTypes[j] == Types[i]) {
            custom = '';
            break;
          }
        }
        document.getElementById("currFilters").innerHTML += ', ' + currTypes[j] + custom;
      }
    }
  }

  function start() {

    chrome.tabs.executeScript(null, {
      code: 'var schemasName =' + JSON.stringify(currTypes)
    });

    if (JSON.stringify(currFormats).indexOf("JSON-LD") !== -1) {
      chrome.tabs.executeScript(null, {
        file: "getJSONLD.js"
      }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
    }

    if (JSON.stringify(currFormats).indexOf("Microdata") !== -1) {
      chrome.tabs.executeScript(null, {
        file: "getJSONFromMicrodata.js"
      }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
    }

    if (JSON.stringify(currFormats).indexOf("RDFa") !== -1) {
      chrome.tabs.executeScript(null, {
        file: "getJSONFromRDFa.js"
      }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
    }
  }
  function eventListeners() {
    document.getElementById("exportMicrodataButt").addEventListener("click", function () {
      chrome.tabs.executeScript(null, {
        code: 'var extractedJson =' + JSON.stringify(extractedJson)
      });
      chrome.tabs.executeScript(null, {
        file: "exportAsMicrodata.js"
      }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
    });

    document.getElementById("exportRDFaButt").addEventListener("click", function () {
      chrome.tabs.executeScript(null, {
        code: 'var extractedJson =' + JSON.stringify(extractedJson)
      });
      chrome.tabs.executeScript(null, {
        file: "exportAsRDFa.js"
      }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
    });

    document.getElementById("exportJSONLDButt").addEventListener("click", function () {
      chrome.tabs.executeScript(null, {
        code: 'var extractedJson =' + JSON.stringify(extractedJson)
      });
      chrome.tabs.executeScript(null, {
        file: "exportAsJSONLD.js"
      }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
          message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
        }
      });
    });

    for (var i = 1; i <= 5; i++) {
      document.getElementById("level-" + i).style.background = getColorByLevel(i);
    }
    document.getElementById("filterCheck").addEventListener("click", function () {
      if (this.checked) {
        document.getElementById("currFilters").style.display = "none";
        document.getElementById("addFilter").disabled = true;
        document.getElementById("removeFilter").disabled = true;
        saveFilters(null);
      } else {
        document.getElementById("currFilters").style.display = "block";
        document.getElementById("addFilter").disabled = false;
        document.getElementById("removeFilter").disabled = false;
        currTypes = [];
        updateFilters();
=======
  
  function onWindowLoad() {
    var message = document.querySelector('#message');
    var array = ["Event","Organization","TouristAttraction"]
    chrome.tabs.executeScript(null, {
      code: 'var schemasName =' + JSON.stringify(array)
    });

    chrome.tabs.executeScript(null, {
      file: "getJSONFromMicrodata.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
>>>>>>> d9e093a9b33f523d3b3520a58b5d927013215d3b
      }

    });

    formats = document.getElementsByName("format");
    for (i = 0; i < formats.length; i++) {
      formats[i].addEventListener('change', function () {
        if (this.checked) {
          currFormats[currFormats.length] = this.id;
        } else {
          for (j = 0; j < formats.length; j++) {
            if (currFormats[j] == this.id) {
              currFormats.splice(j, 1);
            }
          }
        }
        saveFormats(currFormats);
      });
    }

    function changeTab(currTab) {
      var tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("active", "");
      }
      document.getElementById(currTab).style.display = "block";
    }

    document.getElementById("settingsButt").addEventListener("click", function () {
      changeTab("Settings");
    });
    document.getElementById("homeButt").addEventListener("click", function () {
      changeTab("Home");
    });
    document.getElementById("searchTypes").addEventListener("input", function () {
      var counter = 0;
      document.getElementById("validTypes").innerHTML = '';
      for (var i = 0; i < Types.length && counter < 5; i++) {
        if (Types[i].indexOf(document.getElementById("searchTypes").value) === 0 && document.getElementById("searchTypes").value != '') {
          if (counter == 0) {
            document.getElementById("validTypes").innerHTML += '<h5>Valid Matches:<h5>';
            document.getElementById("validTypes").innerHTML += Types[i];
            counter++;
          } else {
            counter++;
            document.getElementById("validTypes").innerHTML += ', ' + Types[i];
          }
        }
      }
    });

    document.getElementById("addFilter").addEventListener("click", function () {
      var alreadyFilter = true;
      for (var i = 0; i < currTypes.length; i++) {
        if (document.getElementById("searchTypes").value == currTypes[i]) {
          return;
        }
      };
      currTypes[currTypes.length] = document.getElementById("searchTypes").value;
      updateFilters();
      saveFilters(currTypes);
    });

    document.getElementById("removeFilter").addEventListener("click", function () {
      document.getElementById("errorSearch").style.display = "block";
      for (var i = 0; i < currTypes.length; i++) {
        if (document.getElementById("searchTypes").value == currTypes[i]) {
          currTypes.splice(i, 1);
          updateFilters();
          saveFilters(currTypes);
          document.getElementById("errorSearch").style.display = "none";
          break;
        }
      };
    });
<<<<<<< HEAD
  }
}
function getColorByLevel(level) {
  return "rgba(" + (level * 120 % 255) + ',' + (level * 50 % 255) + ',' + (130 - level * 20 % 255) + ", 0.4)";
}
function saveFilters(value) {
  chrome.storage.sync.set({ "currFilters": value }, function () {
  });
}
function saveFormats(value) {
  chrome.storage.sync.set({ "currFormats": value }, function () {
  });
}


window.onload = onWindowLoad;

var Types = [
  "Action",
  "AchieveAction",
  "LoseAction",
  "TieAction",
  "WinAction",
  "AssessAction",
  "ChooseAction",
  "VoteAction",
  "IgnoreAction",
  "ReactAction",
  "AgreeAction",
  "DisagreeAction",
  "DislikeAction",
  "EndorseAction",
  "LikeAction",
  "WantAction",
  "ReviewAction",
  "ConsumeAction",
  "DrinkAction",
  "EatAction",
  "InstallAction",
  "ListenAction",
  "ReadAction",
  "UseAction",
  "WearAction",
  "ViewAction",
  "WatchAction",
  "ControlAction",
  "ActivateAction",
  "DeactivateAction",
  "ResumeAction",
  "SuspendAction",
  "CreateAction",
  "CookAction",
  "DrawAction",
  "FilmAction",
  "PaintAction",
  "PhotographAction",
  "WriteAction",
  "FindAction",
  "CheckAction",
  "DiscoverAction",
  "TrackAction",
  "InteractAction",
  "BefriendAction",
  "CommunicateAction",
  "AskAction",
  "CheckInAction",
  "CheckOutAction",
  "CommentAction",
  "InformAction",
  "ConfirmAction",
  "RsvpAction",
  "InviteAction",
  "ReplyAction",
  "ShareAction",
  "FollowAction",
  "JoinAction",
  "LeaveAction",
  "MarryAction",
  "RegisterAction",
  "SubscribeAction",
  "UnRegisterAction",
  "MoveAction",
  "ArriveAction",
  "DepartAction",
  "TravelAction",
  "OrganizeAction",
  "AllocateAction",
  "AcceptAction",
  "AssignAction",
  "AuthorizeAction",
  "RejectAction",
  "ApplyAction",
  "BookmarkAction",
  "PlanAction",
  "CancelAction",
  "ReserveAction",
  "ScheduleAction",
  "PlayAction",
  "ExerciseAction",
  "PerformAction",
  "SearchAction",
  "TradeAction",
  "BuyAction",
  "DonateAction",
  "OrderAction",
  "PayAction",
  "QuoteAction",
  "RentAction",
  "SellAction",
  "TipAction",
  "TransferAction",
  "BorrowAction",
  "DownloadAction",
  "GiveAction",
  "LendAction",
  "ReceiveAction",
  "ReturnAction",
  "SendAction",
  "TakeAction",
  "UpdateAction",
  "AddAction",
  "InsertAction",
  "AppendAction",
  "PrependAction",
  "DeleteAction",
  "ReplaceAction",
  "CreativeWork",
  "Article",
  "NewsArticle",
  "Report",
  "ScholarlyArticle",
  "SocialMediaPosting",
  "BlogPosting",
  "LiveBlogPosting",
  "DiscussionForumPosting",
  "TechArticle",
  "APIReference",
  "Blog",
  "Book",
  "Clip",
  "MovieClip",
  "RadioClip",
  "TVClip",
  "VideoGameClip",
  "Comment",
  "Answer",
  "Conversation",
  "Course",
  "CreativeWorkSeason",
  "RadioSeason",
  "TVSeason",
  "CreativeWorkSeries",
  "BookSeries",
  "MovieSeries",
  "Periodical",
  "RadioSeries",
  "TVSeries",
  "VideoGameSeries",
  "DataCatalog",
  "Dataset",
  "DataFeed",
  "DigitalDocument",
  "NoteDigitalDocument",
  "PresentationDigitalDocument",
  "SpreadsheetDigitalDocument",
  "TextDigitalDocument",
  "Episode",
  "RadioEpisode",
  "TVEpisode",
  "Game",
  "VideoGame",
  "HowTo",
  "Recipe",
  "HowToDirection",
  "HowToSection",
  "HowToStep",
  "HowToTip",
  "Map",
  "MediaObject",
  "AudioObject",
  "DataDownload",
  "ImageObject",
  "Barcode",
  "MusicVideoObject",
  "VideoObject",
  "Menu",
  "MenuSection",
  "Message",
  "EmailMessage",
  "Movie",
  "MusicComposition",
  "MusicPlaylist",
  "MusicAlbum",
  "MusicRelease",
  "MusicRecording",
  "Painting",
  "Photograph",
  "PublicationIssue",
  "PublicationVolume",
  "Question",
  "Review",
  "ClaimReview",
  "Sculpture",
  "Series",
  "SoftwareApplication",
  "MobileApplication",
  "VideoGame",
  "WebApplication",
  "SoftwareSourceCode",
  "TVSeason",
  "TVSeries",
  "VisualArtwork",
  "WebPage",
  "AboutPage",
  "CheckoutPage",
  "CollectionPage",
  "ImageGallery",
  "VideoGallery",
  "ContactPage",
  "ItemPage",
  "ProfilePage",
  "QAPage",
  "SearchResultsPage",
  "WebPageElement",
  "SiteNavigationElement",
  "Table",
  "WPAdBlock",
  "WPFooter",
  "WPHeader",
  "WPSideBar",
  "WebSite",
  "Event",
  "BusinessEvent",
  "ChildrensEvent",
  "ComedyEvent",
  "CourseInstance",
  "DanceEvent",
  "DeliveryEvent",
  "EducationEvent",
  "ExhibitionEvent",
  "Festival",
  "FoodEvent",
  "LiteraryEvent",
  "MusicEvent",
  "PublicationEvent",
  "BroadcastEvent",
  "OnDemandEvent",
  "SaleEvent",
  "ScreeningEvent",
  "SocialEvent",
  "SportsEvent",
  "TheaterEvent",
  "VisualArtsEvent",
  "Intangible",
  "AlignmentObject",
  "Audience",
  "BusinessAudience",
  "EducationalAudience",
  "PeopleAudience",
  "ParentAudience",
  "BedDetails",
  "Brand",
  "BroadcastChannel",
  "RadioChannel",
  "TelevisionChannel",
  "BusTrip",
  "ComputerLanguage",
  "DataFeedItem",
  "Demand",
  "DigitalDocumentPermission",
  "EntryPoint",
  "Enumeration",
  "ActionStatusType",
  "BoardingPolicyType",
  "BookFormatType",
  "BusinessEntityType",
  "BusinessFunction",
  "ContactPointOption",
  "DayOfWeek",
  "DeliveryMethod",
  "LockerDelivery",
  "ParcelService",
  "DigitalDocumentPermissionType",
  "EventStatusType",
  "GamePlayMode",
  "GameServerStatus",
  "GenderType",
  "ItemAvailability",
  "ItemListOrderType",
  "MapCategoryType",
  "MusicAlbumProductionType",
  "MusicAlbumReleaseType",
  "MusicReleaseFormatType",
  "OfferItemCondition",
  "OrderStatus",
  "PaymentMethod",
  "PaymentCard",
  "CreditCard",
  "PaymentStatusType",
  "QualitativeValue",
  "DriveWheelConfigurationValue",
  "SteeringPositionValue",
  "ReservationStatusType",
  "RestrictedDiet",
  "RsvpResponseType",
  "Specialty",
  "WarrantyScope",
  "Flight",
  "GameServer",
  "Invoice",
  "ItemList",
  "BreadcrumbList",
  "HowToSection",
  "HowToStep",
  "OfferCatalog",
  "JobPosting",
  "Language",
  "ListItem",
  "HowToDirection",
  "HowToItem",
  "HowToSupply",
  "HowToTool",
  "HowToStep",
  "HowToTip",
  "MenuItem",
  "Offer",
  "AggregateOffer",
  "Order",
  "OrderItem",
  "ParcelDelivery",
  "Permit",
  "GovernmentPermit",
  "ProgramMembership",
  "PropertyValueSpecification",
  "Quantity",
  "Distance",
  "Duration",
  "Energy",
  "Mass",
  "Rating",
  "AggregateRating",
  "Reservation",
  "BusReservation",
  "EventReservation",
  "FlightReservation",
  "FoodEstablishmentReservation",
  "LodgingReservation",
  "RentalCarReservation",
  "ReservationPackage",
  "TaxiReservation",
  "TrainReservation",
  "Role",
  "OrganizationRole",
  "EmployeeRole",
  "PerformanceRole",
  "Seat",
  "Service",
  "BroadcastService",
  "CableOrSatelliteService",
  "FinancialProduct",
  "BankAccount",
  "DepositAccount",
  "CurrencyConversionService",
  "InvestmentOrDeposit",
  "DepositAccount",
  "LoanOrCredit",
  "CreditCard",
  "PaymentCard",
  "PaymentService",
  "FoodService",
  "GovernmentService",
  "TaxiService",
  "ServiceChannel",
  "StructuredValue",
  "ContactPoint",
  "PostalAddress",
  "EngineSpecification",
  "GeoCoordinates",
  "GeoShape",
  "GeoCircle",
  "InteractionCounter",
  "MonetaryAmount",
  "NutritionInformation",
  "OpeningHoursSpecification",
  "OwnershipInfo",
  "PriceSpecification",
  "CompoundPriceSpecification",
  "DeliveryChargeSpecification",
  "PaymentChargeSpecification",
  "UnitPriceSpecification",
  "PropertyValue",
  "Property",
  "LocationFeatureSpecification",
  "QuantitativeValue",
  "TypeAndQuantityNode",
  "WarrantyPromise",
  "Ticket",
  "TrainTrip",
  "Organization",
  "Airline",
  "Corporation",
  "EducationalOrganization",
  "CollegeOrUniversity",
  "ElementarySchool",
  "HighSchool",
  "MiddleSchool",
  "Preschool",
  "School",
  "GovernmentOrganization",
  "LocalBusiness",
  "AnimalShelter",
  "AutomotiveBusiness",
  "AutoBodyShop",
  "AutoDealer",
  "AutoPartsStore",
  "AutoRental",
  "AutoRepair",
  "AutoWash",
  "GasStation",
  "MotorcycleDealer",
  "MotorcycleRepair",
  "ChildCare",
  "Dentist",
  "DryCleaningOrLaundry",
  "EmergencyService",
  "FireStation",
  "Hospital",
  "PoliceStation",
  "EmploymentAgency",
  "EntertainmentBusiness",
  "AdultEntertainment",
  "AmusementPark",
  "ArtGallery",
  "Casino",
  "ComedyClub",
  "MovieTheater",
  "NightClub",
  "FinancialService",
  "AccountingService",
  "AutomatedTeller",
  "BankOrCreditUnion",
  "InsuranceAgency",
  "FoodEstablishment",
  "Bakery",
  "BarOrPub",
  "Brewery",
  "CafeOrCoffeeShop",
  "FastFoodRestaurant",
  "IceCreamShop",
  "Restaurant",
  "Winery",
  "GovernmentOffice",
  "PostOffice",
  "HealthAndBeautyBusiness",
  "BeautySalon",
  "DaySpa",
  "HairSalon",
  "HealthClub",
  "NailSalon",
  "TattooParlor",
  "HomeAndConstructionBusiness",
  "Electrician",
  "GeneralContractor",
  "HVACBusiness",
  "HousePainter",
  "Locksmith",
  "MovingCompany",
  "Plumber",
  "RoofingContractor",
  "InternetCafe",
  "LegalService",
  "Attorney",
  "Notary",
  "Library",
  "LodgingBusiness",
  "BedAndBreakfast",
  "Campground",
  "Hostel",
  "Hotel",
  "Motel",
  "Resort",
  "ProfessionalService",
  "RadioStation",
  "RealEstateAgent",
  "RecyclingCenter",
  "SelfStorage",
  "ShoppingCenter",
  "SportsActivityLocation",
  "BowlingAlley",
  "ExerciseGym",
  "GolfCourse",
  "HealthClub",
  "PublicSwimmingPool",
  "SkiResort",
  "SportsClub",
  "StadiumOrArena",
  "TennisComplex",
  "Store",
  "AutoPartsStore",
  "BikeStore",
  "BookStore",
  "ClothingStore",
  "ComputerStore",
  "ConvenienceStore",
  "DepartmentStore",
  "ElectronicsStore",
  "Florist",
  "FurnitureStore",
  "GardenStore",
  "GroceryStore",
  "HardwareStore",
  "HobbyShop",
  "HomeGoodsStore",
  "JewelryStore",
  "LiquorStore",
  "MensClothingStore",
  "MobilePhoneStore",
  "MovieRentalStore",
  "MusicStore",
  "OfficeEquipmentStore",
  "OutletStore",
  "PawnShop",
  "PetStore",
  "ShoeStore",
  "SportingGoodsStore",
  "TireShop",
  "ToyStore",
  "WholesaleStore",
  "TelevisionStation",
  "TouristInformationCenter",
  "TravelAgency",
  "MedicalOrganization",
  "Dentist",
  "Hospital",
  "Pharmacy",
  "Physician",
  "NGO",
  "PerformingGroup",
  "DanceGroup",
  "MusicGroup",
  "TheaterGroup",
  "SportsOrganization",
  "SportsTeam",
  "Person",
  "Place",
  "Accommodation",
  "Apartment",
  "CampingPitch",
  "House",
  "SingleFamilyResidence",
  "Room",
  "HotelRoom",
  "MeetingRoom",
  "Suite",
  "AdministrativeArea",
  "City",
  "Country",
  "State",
  "CivicStructure",
  "Airport",
  "Aquarium",
  "Beach",
  "Bridge",
  "BusStation",
  "BusStop",
  "Campground",
  "Cemetery",
  "Crematorium",
  "EventVenue",
  "FireStation",
  "GovernmentBuilding",
  "CityHall",
  "Courthouse",
  "DefenceEstablishment",
  "Embassy",
  "LegislativeBuilding",
  "Hospital",
  "MovieTheater",
  "Museum",
  "MusicVenue",
  "Park",
  "ParkingFacility",
  "PerformingArtsTheater",
  "PlaceOfWorship",
  "BuddhistTemple",
  "CatholicChurch",
  "Church",
  "HinduTemple",
  "Mosque",
  "Synagogue",
  "Playground",
  "PoliceStation",
  "RVPark",
  "StadiumOrArena",
  "SubwayStation",
  "TaxiStand",
  "TrainStation",
  "Zoo",
  "Landform",
  "BodyOfWater",
  "Canal",
  "LakeBodyOfWater",
  "OceanBodyOfWater",
  "Pond",
  "Reservoir",
  "RiverBodyOfWater",
  "SeaBodyOfWater",
  "Waterfall",
  "Continent",
  "Mountain",
  "Volcano",
  "LandmarksOrHistoricalBuildings",
  "LocalBusiness",
  "Residence",
  "ApartmentComplex",
  "GatedResidenceCommunity",
  "TouristAttraction",
  "Product",
  "IndividualProduct",
  "ProductModel",
  "SomeProducts",
  "Vehicle",
  "Car"]
=======
}
  
  window.onload = onWindowLoad;
>>>>>>> d9e093a9b33f523d3b3520a58b5d927013215d3b
