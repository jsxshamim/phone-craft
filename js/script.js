const elementShowHide = (show, id) => {
    document.getElementById(id).style.display = show ? "block" : "none";
};

const loadPhoneData = () => {
    const searchInput = document.getElementById("search-phone");
    const searchKeyword = searchInput.value.toLowerCase();
    document.getElementById("search-keyword").innerText = searchKeyword;
    document.getElementById("phones-container").innerHTML = "";
    elementShowHide(true, "result-header");
    elementShowHide(false, "single-container");
    getData(searchKeyword);
};
const getPhoneData = () => {
    fetch(`https://openapi.programming-hero.com/api/phones?search=g`)
        .then((res) => res.json())
        .then((data) => getSearchResult(data.data, data.status));
};

getPhoneData();

const getData = (searchKeyword) => {
    fetch(`https://openapi.programming-hero.com/api/phones?search=${searchKeyword}`)
        .then((res) => res.json())
        .then((data) => getSearchResult(data.data, data.status));
};

const searchMessageChange = (status, message) => {
    const searchMessage = document.getElementById("search-message");
    status ? searchMessage.classList.add("border-success") : searchMessage.classList.remove("border-success");
    !status ? searchMessage.classList.add("border-danger") : searchMessage.classList.remove("border-danger");
    searchMessage.innerText = message;
};

const getSearchResult = (phones, status) => {
    if (!status) {
        searchMessageChange(status, "We're sorry, we found no results");
    } else {
        const phonesContainer = document.getElementById("phones-container");
        const slice20Phones = phones.slice(0, 20);
        slice20Phones.forEach(({ brand, image, phone_name, slug }) => {
            searchMessageChange(status, `Your search returned ${phones.length} results. Only the most popular ${slice20Phones.length} devices shown.`);
            const card = document.createElement("div");
            card.classList.add("col");
            card.innerHTML = `
            <div class="card border-0">
                <div class="card-head">
                    <img src="${image}" class="w-75" alt="${slug}" />
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

const handleSingleData = (slug) => {
    elementShowHide(false, "result-header");
    elementShowHide(true, "single-container");
    loadSingleData(slug);
};

const loadSingleData = (slug) => {
    const api = `https://openapi.programming-hero.com/api/phone/${slug}`;
    fetch(api)
        .then((res) => res.json())
        .then((data) => getPhoneDetails(data.data));
};

const getPhoneDetails = (data) => {
    const singleContainer = document.getElementById("single-container");
    const featuresDetails = document.createElement("div");
    featuresDetails.classList.add("container-fluid");
    console.log(featuresDetails);
    featuresDetails.innerHTML = `
        <div class="single-phone-head border row my-3 p-3">
            <h3 class="phone-title m-0 mb-2 fw-bolder text-dark">Samsung Galaxy Note 30</h3>
            <h5 class="m-0">Brand: <span class="text-color me-4">Samsung </span> Status: <span>Rumored</span></h5>
        </div>
        <div class="row">
            <div class="col-md-5 border text-center">
                <img id="phone-image" class="w-75 py-5" src="https://fdn2.gsmarena.com/vv/bigpic/apple-iphone-13-pro-max.jpg" alt="" />
            </div>
            <div class="phone-features col-md-7 ps-5">
                <div class="row">
                    <h4 class="text-color py-3 ps-4 border fw-bolder">Key Specifications :</h4>
                </div>
                <div class="row row-cols-md-2 mt-3 ps-3 py-3 border">
                    <div class="col d-flex mb-5">
                        <div class="feature-icon me-3">
                            <i class="fa-solid fa-calendar-check"></i>
                        </div>
                        <div class="feature-text">
                            <h5 class="text-muted mb-2">Released</h5>
                            <h5>Not Announced</h5>
                        </div>
                    </div>
                    <div class="col d-flex mb-5">
                        <div class="feature-icon me-3">
                            <i class="fa-solid fa-hard-drive"></i>
                        </div>
                        <div class="feature-text">
                            <h5 class="text-muted mb-2">Storage</h5>
                            <h5>128GB/256GB/1TB storage, no card slot</h5>
                        </div>
                    </div>
                    <div class="col d-flex mb-5">
                        <div class="feature-icon me-3">
                            <i class="fa-solid fa-mobile-screen"></i>
                        </div>
                        <div class="feature-text">
                            <h5 class="text-muted mb-2">Display</h5>
                            <h5>6.7 inches, 109.8 cm2 (~87.4% screen-to-body ratio)</h5>
                        </div>
                    </div>
                    <div class="col d-flex mb-5">
                        <div class="feature-icon me-3">
                            <i class="fa-solid fa-sd-card"></i>
                        </div>
                        <div class="feature-text">
                            <h5 class="text-muted mb-2">Storage</h5>
                            <h5>128GB 6GB RAM, 256GB 6GB RAM, 512GB 6GB RAM, 1TB 6GB RAM</h5>
                        </div>
                    </div>
                    <div class="col d-flex mb-5">
                        <div class="feature-icon me-3">
                            <i class="fa-solid fa-microchip"></i>
                        </div>
                        <div class="feature-text">
                            <h5 class="text-muted mb-2">ChipSet</h5>
                            <h5>Apple A15 Bionic (5 nm)</h5>
                        </div>
                    </div>
                    <div class="col d-flex mb-5">
                        <div class="feature-icon me-3">
                            <i class="fa-brands fa-nfc-symbol"></i>
                        </div>
                        <div class="feature-text">
                            <h5 class="text-muted mb-2">Sensors</h5>
                            <h5>"Face ID", "accelerometer", "gyro", "proximity", "compass", "barometer"</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

    singleContainer.appendChild(featuresDetails);
};

const setInnerValue = (id) => {};
