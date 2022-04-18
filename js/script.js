fetch(`https://openapi.programming-hero.com/api/phones?search=a`)
    .then((res) => res.json())
    .then((data) => getSearchResult(data.data, data.status));

const getSearchResult = (phones, status) => {
    console.log(phones, status);
};
