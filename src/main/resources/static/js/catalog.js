var catalogProducts;
var catalogSelectedItem = -1;

var catalogSelectedCategory = decodeURIComponent(window.location.search.substr(1));
// var catalogCharacteristics = {};

var catalogDomains;

function getCharacteristicStringValue(characteristic, dataType) {
    if (dataType == "NUMBER") {
        return characteristic.numberValue;
    }

    if (dataType == "STRING")
        return characteristic.stringValue;

    if (dataType == "DATE") {
        return moment.unix(characteristic.dateValue).format("LLL")
    }
}

function getRegionalPrice(regionId) {
    var price = "";
    catalogProducts[catalogSelectedItem].prices.forEach(function(item) {
        if (item.region.regionId == regionId)
            price = item.price;
    });

    return price;
}

function selectCatalogProduct(index, positionInList) {
    $("#catalog-main-info").removeClass("hidden");

    catalogSelectedItem = index;

    var list = $("#catalog-products-list");
    list.find("a").removeClass("active");
    list.find("a:nth-child(" + positionInList + ")").addClass("active");

    $(".table-row").remove();

    $("#catalog-product-name").text(catalogProducts[index].productName);
    $("#catalog-product-description").text(catalogProducts[index].productDescription);

    var table = $("#catalog-table-details");
    catalogProducts[index].productCharacteristicValues.forEach(function (item) {
           var html = '<tr class="table-row"><td>' +
                   item.productCharacteristic.characteristicName +
            '</td>' +
            '<td>' +
                   getCharacteristicStringValue(item, item.productCharacteristic.dataType.categoryName) +
                   item.productCharacteristic.measure +
            '</td></tr>';

        table.append($(html));
    });

    var html = '<tr class="table-row"><td>Price</td><td>' +
                    getRegionalPrice(localStorage.getItem("regionId")) +
                '</td></tr>';
    table.append($(html));
}

function updateCatalog() {
    console.log("Updating catalog");
    var list = $("#catalog-products-list");
    list.empty();
    $("#catalog-main-info").addClass("hidden");

    var positionInList = 1;
    catalogProducts.forEach(function(item, index) {
        if (item.productType.productTypeName == catalogSelectedCategory) {
            var ref = document.createElement("a");
            ref.appendChild(document.createTextNode(item.productName));
            ref.className = "list-group-item";
            ref.href = "#";
            var position = positionInList++;
            ref.onclick = function () {
                selectCatalogProduct(index, position);
            };
            list.append(ref);
        }
    });
}

function loadCatalogData() {
    console.log("Loading catalog data");
    $.ajax({
        url: "/api/user/products/byRegion/" + localStorage.getItem("regionId"),
        success: function(data) {
            catalogProducts = data;
            updateCatalog();
        },
        error: function () {
            console.error("Cannot load list of products");
        }
    });
}

function loadDomainsData() {
    console.log("Loading domains data for catalog");
    $.ajax({
        url: "/api/client/domains/get/all",
        success: function(data) {
            var select = $("#catalog-domain-selector");
            select.empty();

            catalogDomains = {};
            data.forEach(function (domain) {
                catalogDomains[domain.domainId] = domain;

                var option = document.createElement("option");
                option.text = domain.domainName;
                option.value = domain.domainId;
                select.append(option);
            });

            if (data.length > 0) {
                $("#catalog-new-order-button").removeClass("hidden");
            }
        },
        error: function () {
            console.error("Cannot load list of domains");
        }
    });
}

function catalogChangeDomain(domainId) {
    //TODO display address
    var price = getRegionalPrice(catalogDomains[domainId].regionId);
    if (price == "") {
        price = "Product unavailable in this region";
        $('#new-product-order-modal-submit').addClass("disabled");
    } else {
        $('#new-product-order-modal-submit').removeClass("disabled");
    }

    $('#catalog-price-field').val(price);
}

function catalogSubmitOrder() {

    var selectedDomainIndex = $("#catalog-domain-selector").val()[0];

    $.ajax({
        url: "/api/client/orders/new/create",
        method: "POST",
        headers: {
            'X-CSRF-TOKEN': $('meta[name=_csrf]').attr("content")
        },
        contentType: 'application/json',
        data: JSON.stringify({
            productId: catalogProducts[catalogSelectedItem].productId,
            domainId: catalogDomains[selectedDomainIndex].domainId
        }),
        success: function(data) {
            if (data.status == "success") {
                console.log(data.message);
                var info = window.name == "" ? {} : JSON.parse(window.name);
                info.selectedInstanceId = data.instanceId;
                window.name = JSON.stringify(info);
                window.location.href = "/client/instance";
            } else {
                console.error("Cannot create order: " + data.message);
            }
        },
        error: function (data) {
            console.error("Cannot create order: ");
            console.error(data);
        }
    });
}

function catalogCreateOrder() {
    $('#new-product-order-modal').modal('toggle');
    $('#new-product-order-modal-submit').addClass("disabled");
    $("#catalog-domain-selector").val([]);
    $('#catalog-price-field').val("")
}

$(document).on("account-loaded", loadDomainsData);
$(document).on("region-changed", loadCatalogData);