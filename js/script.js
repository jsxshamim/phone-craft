// get search value from input
const getSearchInputValue = () => {
    const searchInputLg = document.getElementById("search-phone-lg");
    const searchInputMd = document.getElementById("search-phone-md");
    const searchKeyword = searchInputLg.value ? searchInputLg.value.toLowerCase() : searchInputMd.value.toLowerCase();
    if (!searchKeyword) {
        searchInputLg.style.border = "1px solid red";
        searchInputMd.style.border = "1px solid red";
    } else {
        searchInputLg.style.border = "1px solid #ced4da";
        searchInputMd.style.border = "1px solid #ced4da";
        return searchKeyword;
    }
};

// set search input value in local storage
const setLocalStorage = (keyword, key) => {
    const keyStringify = JSON.stringify(keyword);
    localStorage.setItem(key, keyStringify);
};

// element show hide condition
const elementShowHide = (show, id) => {
    document.getElementById(id).style.display = show ? "block" : "none";
};

// Handle Search keyword nad error handled
const searchHandler = () => {
    const searchKeyword = getSearchInputValue();
    if (!searchKeyword) {
        showToast("error-handle", true, "Please Fill out Search Field");
    } else {
        setLocalStorage(searchKeyword, "keyword");
        document.getElementById("search-keyword").innerText = searchKeyword;
        elementShowHide(true, "result-header");
        elementShowHide(false, "single-container");
        loadPhoneData(searchKeyword);
        document.getElementById("search-phone-lg").value = "";
        document.getElementById("search-phone-md").value = "";
    }
};

// load search items form api
const loadPhoneData = (searchKeyword) => {
    fetch(`https://openapi.programming-hero.com/api/phones?search=${searchKeyword}`)
        .then((res) => res.json())
        .then((data) => getSearchResult(data.data, data.status))
        .catch((err) => showToast("error-handle", true, err.message));
};

// Display Default items
const getStaticData = () => {
    fetch(`https://openapi.programming-hero.com/api/phones?search=g`)
        .then((res) => res.json())
        .then((data) => getSearchResult(data.data, data.status))
        .catch((err) => showToast("error-handle", true, err.message));
};
// default item displaying
getStaticData();

// Handled Search Header message
const searchMessageChange = (status, message) => {
    const searchMessage = document.getElementById("search-message");
    status ? searchMessage.classList.add("border-success") : searchMessage.classList.remove("border-success");
    !status ? searchMessage.classList.add("border-danger") : searchMessage.classList.remove("border-danger");
    searchMessage.innerText = message;
};

// Function for Create an Element and append html code
const createElement = (className) => {
    const element = document.createElement("div");
    element.classList.add(className);
    return element;
};

// Clear Container Data when generate new Data
const clearContainer = (id) => {
    const container = document.getElementById(id);
    container.innerHTML = "";
    return container;
};

// Get Search Result and Displaying 20 Items on UI
const getSearchResult = (phones, status, isShowAll) => {
    if (!status) {
        clearContainer("phones-container");
        searchMessageChange(status, "We're sorry, we found no results");
    } else {
        const phonesContainer = clearContainer("phones-container");

        // Slice 20 Items, If Clicking Show Button Showing upto 100 Items
        const displayItems = phones.slice(0, !isShowAll ? 20 : 100);

        displayItems.forEach(({ brand, image, phone_name, slug }) => {
            searchMessageChange(status, `Your search returned ${phones.length} results. Only the most popular ${displayItems.length} devices shown.`);
            const card = createElement("col");
            card.innerHTML = `
            <div class="card py-3 border-0">
                <div class="card-head">
                    <img src="${image}" class="card-image" alt="${slug}" />
                </div>
                <div class="card-body text-center">
                    <h6 class="card-title">${brand} ${phone_name}</h6>
                    <button onclick="handleSingleData('${slug}')" class="btn btn-danger mt-3">See Details</button>
                </div>
            </div>`;
            phonesContainer.appendChild(card);
        });
    }
    // show more button displaying condition
    document.getElementById("show-more-btn").style.display = phones.length >= 20 ? "block" : "none";
};

// get search input value in local storage
const getLocalStorage = (key) => {
    const getKey = localStorage.getItem(key);
    const keyword = JSON.parse(getKey);
    return keyword;
};

// Show All Items Clicking by Show More Button
const showMoreHandler = () => {
    const searchKeyword = getLocalStorage("keyword");
    fetch(`https://openapi.programming-hero.com/api/phones?search=${searchKeyword}`)
        .then((res) => res.json())
        .then((data) => getSearchResult(data.data, data.status, true))
        .catch((err) => showToast("error-handle", true, err.message));
};

// Handled Item Details Clicking by See Details Button on Each Item
const handleSingleData = (slug) => {
    elementShowHide(true, "single-container");
    loadSingleData(slug);
    document.getElementById("single-container").scrollIntoView();
};

// Load Single Item from API Finding by slug
const loadSingleData = (slug) => {
    const api = `https://openapi.programming-hero.com/api/phone/${slug}`;
    fetch(api)
        .then((res) => res.json())
        .then((data) => getPhoneDetails(data.data));
};

// set Key Specifications right side of item details
const setSpecifications = (id, featureName, icon) => {
    return `
        <div class="col d-flex mb-4 md-lg-5">
            <div class="feature-icon me-3">
                <i class="fa-solid fa-${icon}"></i>
            </div>
            <div class="feature-text">
                <h5 class="text-muted mb-2">${featureName}</h5>
                <h5>${id}</h5>
            </div>
        </div>`;
};

// Get Single Items Details and showing on UI
const getPhoneDetails = (data) => {
    const { slug, name, releaseDate, brand, image, mainFeatures } = data;
    const { storage, displaySize, chipSet, memory, sensors } = mainFeatures;

    // others item error handled if other not exist in api
    const others = data?.others ? Object.entries(data?.others) : [["Error", "Others Feature Not Found"]];

    // set sensors
    const displaySensors = sensors.map((sensor) => sensor);

    // set others Feature
    const otherFeatures = others.map(([featureName, feature]) => {
        return `
            <tr>
                <th>${featureName} :</th>
                <td>${feature === "No" ? `<i class="text-danger fa-solid fa-circle-xmark"></i>` : feature === "Yes" ? `<i class="text-success fa-solid fa-circle-check"></i>` : feature}</td>
            </tr>`;
    });

    // Clear Container Data when generate new Data
    const singleContainer = clearContainer("single-container");

    // Create Element and append html code
    const featuresDetails = createElement("container-fluid");

    featuresDetails.innerHTML = `
        <div class="single-phone-head border row my-3 p-3">
            <h3 class="phone-title m-0 mb-2 fw-bolder text-dark">${brand} ${name}</h3>
            <h5 class="m-0 fs-6">Brand: <span class="text-danger me-4">${brand} </span> Category: <span class="text-danger">${slug.includes("watch") ? "Watch" : slug.includes("tab") ? "Tablet" : "Phone"} </span> </h5>
        </div>
        <div class="row">
            <div class="col-md-5 border d-flex align-items-center justify-content-center py-5 py-md-0">
                <img id="phone-image" class="w-50" src="${image}" alt="${slug}" />
            </div>
            <div class="phone-features col-md-7 mt-3 mt-md-0 ps-2 ps-md-5">
                <div class="row">
                    <h4 class="text-color py-3 ps-4 border fw-bolder">Key Specifications :</h4>
                </div>
                <div class="row row-cols-lg-2 row-cols-md-1 row-cols-sm-2 row-cols-1 mt-3 ps-3 py-3 border">
                    ${setSpecifications(releaseDate ? releaseDate : "<span class='text-danger'>Release Date Not Announced</span>", "Release Date", "calendar-check")}
                    ${setSpecifications(storage, "Storage", "sd-card")}
                    ${setSpecifications(displaySize, "Display", "mobile-screen")}
                    ${setSpecifications(memory, "Memory", "memory")}
                    ${setSpecifications(chipSet ? chipSet : "<span class='text-danger'>Unspecified</span>", "ChipSet", "microchip")}
                    ${setSpecifications(displaySensors.join(", "), "Sensors", "tower-broadcast")}
                </div>
            </div>
        </div>
        <div class="others-feature border row my-3 p-3">
            <table >
                <tbody>
                    ${otherFeatures.join("")}
                </tbody>
            </table>
        </div>`;

    singleContainer.appendChild(featuresDetails);
};

// Toast Showing if Search get Error
const showToast = (id, isShowing, message) => {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = message;
    let errorHandler = document.getElementById(id);
    let errToast = new bootstrap.Toast(errorHandler);
    isShowing ? errToast.show() : errToast.hide();
};
