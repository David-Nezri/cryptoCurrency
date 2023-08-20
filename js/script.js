/// <reference path="jquery-3.6.3.js" />


//show all coins in home page //wallet arr => put coins wallet in local storage
let allCoins = [];
//wallet
let newWalletArr = [];
 //functionality of wallet => 0/5
let coinsIndex = 0;
//start point
let chartInterval = false;
// a sub arr for manipulate all coins 
let subArr = [];
//start graphs on 0
let seconds = 0;
//graph 
let graph = { 
    animationEnabled: false,
    theme: "light2",
    title: {
        text: "Coin Price Value" 
    },
    axisX: {
    },
    axisY: {
        title: "USD",
        titleFontSize: 24,
        includeZero: true
    },
    data: [
        {
            type: "line",
            axisYType: "primary",
            name: '',
            showInLegend: true,
            markerSize: 0,
            dataPoints: [],
        },
        {
            type: "line",
            axisYType: "primary",
            name: '',
            showInLegend: true,
            markerSize: 0,
            dataPoints: []
        },
        {
            type: "line",
            axisYType: "primary",
            name: '',
            showInLegend: true,
            markerSize: 0,
            dataPoints: []
        },
        {
            type: "line",
            axisYType: "primary",
            name: "",
            showInLegend: true,
            markerSize: 0,
            dataPoints: []
        },
        {
            type: "line",
            axisYType: "primary",
            name: '',
            showInLegend: true,
            markerSize: 0,
            dataPoints: []
        },
    ]
};

$("#chartContainer").empty().hide();
$('#aboutContainer').empty().hide();
$('.parallax').hide()

$(document).ready(function () {
    loadingPage()
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list",
        success: (data) => {
            allCoins = data;
            buildCard(data, 100);
            console.log(allCoins)
        }
    });
});


//main card show all coins create with bootstrap card
//create toggle btn  with input-tag => in to the wallet 
const buildCard = (coins , amount) => {
    $('#homeContainer').empty().show();
    for (let i = 0; i < amount; i++) {
        $('#homeContainer').append(`
        <div class='col-md-4'>
        <div class="card text-white bg-dark mb-1 mt-1 pl-1 pr-1">
        <div class="card-header">
        <span>${coins[i].symbol}</span>
        <label class="switch">
                        <input class='toggle ${coins[i].id}' ${checkArray(coins[i].symbol)} type="checkbox" onchange='subToCoin("${coins[i].id}")'>
                        <span class="slider round"></span>
                    </label>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${coins[i].name}</h5>
                </div>
                <div class='${coins[i].id} moreinfo'></div>
                <button type="button" class="${coins[i].id} btn card-button btn-secondary" onclick='showInfo("${coins[i].id}")'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-info-square" viewBox="0 0 16 16">
                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg></button>
            </div>
        </div>
        `)
       // console.log(coins.symbol)
}
$('.parallax').show()
loadingPage('done')//gif 
}


//----------check for each item on subArr-----
//-------------& valid if coins in sub arr---------
const checkArray = (symbol) => {
    let checked = false;
    subArr.forEach(item => {
        if (item.symbol == symbol)
         checked = true;
    })
    if (checked) return 'checked';
    //console.log(subArr)
}


//-----------show more info - btn , functionality and  replace coins in the local storage-----------
const showInfo = (id) => {
    let moreInfoObj = [];
    let today = new Date();
    if ($(`.${id}.btn`).html() == 'Show less') {
        $(`.${id}.btn`).html('Show more')
        $(`.${id}.moreinfo`).empty()
    }
    else {
        $(`.${id}.moreinfo`).html('<img src="assets/loading.gif" class="loading" >')
        $(`.${id}.btn`).addClass('disabled')
        
        //----replace in local storage and update local storage ----
        moreInfoObj = JSON.parse(localStorage.getItem(id));
        if (moreInfoObj && (today.getTime() - moreInfoObj.date) <= 120000) {
            buildMoreInfo(moreInfoObj, id);
        } else {
            localStorage.removeItem(id);
            $.ajax({
                url: `https://api.coingecko.com/api/v3/coins/${id}`, success: function (data) {
                    //get current price
                    moreInfoObj = {
                        id: data.id,
                        usd_price: data.market_data.current_price.usd,
                        eur_price: data.market_data.current_price.eur,
                        ils_price: data.market_data.current_price.ils,
                        img: data.image.large,
                        date: today.getTime(),
                    }
                    //console.log(moreInfoObj)
                    //get data from localStorage and build more info object
                    localStorage.setItem(moreInfoObj.id, JSON.stringify(moreInfoObj));
                    buildMoreInfo(moreInfoObj, id);
                }
            });
        }
    }

}


//---------------------build more info cards-----------------------------------
  const buildMoreInfo = (item, id) => {
    $(`.${id}.moreinfo`).html(
        `
    <img src="${item.img}"  class="coin-icon mb-3" alt="">
    <div  class='ml-1 mt-2' >USD Worth: ${item.usd_price}$</div>
    <div class='ml-1 mt-2'>EUR Worth: ${item.eur_price}€</div>
    <div class='ml-1 mt-2 mb-2'>ILS Worth: ${item.ils_price}₪</div>
    `
    )
    $(`.${id}.btn`).removeClass('disabled')
    $(`.${id}.btn`).html('Show less');
}

//search coin by symbol & valid search input
const  searchCoin = () => {
    navigateTo('home');
    event.preventDefault()
    let searched = $('#search_input').val();
    let found = [];
    if (searched == '') {
         buildCard(allCoins, 100); return 
       }
    for (let i = 0; i < allCoins.length; i++) {
        if (allCoins[i].symbol == searched) {
            found.push(allCoins[i])
            buildCard(found, 1)
            return
        }
    }
    //alert message with user search input 
    alert(`Couldn't find ${searched} \n please search by symbol`)
}

//-------------------------modal window (wallet)-------------------------------------------------
const subToCoin = (id) => {
    let toggle_btn = $(`.${id}.toggle`);
//------------wen wallet is full show modal window--------------------
    if (toggle_btn[0].checked) {
        if (coinsIndex  == 5) {
            toggle_btn[0].checked = false;
            let modal = $('.modal-body');
            $('#myModal').modal('show')
            modal.empty()
            for (i = 0; i < subArr.length; i++) {
                modal.append(`
                    <div class='row modal-style'>
                    <div class='col-md-3 in-modal'>${subArr[i].symbol}</div>
                    <label class="switch in-modal">
                        <input class='toggle-in-modal' checked type="checkbox" value='false' onchange='modalSub("${subArr[i].id}")'>
                        <span class="slider round"></span>
                    </label>
                    </div>
                `)
            }
        } else {
            //----------loop for update coins in to wallet------------
            for (let i = 0; i < allCoins.length; i++) {
                if (allCoins[i].id == id) {
                    subArr.push(allCoins[i])
                    
                }
            }
            ++coinsIndex 
        }
        
    } else {
         //---------------loop for taking of coins from wallet ------------
        for (let i = 0; i < subArr.length; i++) {
            if (subArr[i].id == id) {
                subArr.splice(i, 1)
            }
        }
        --coinsIndex 
    }
}
//--------------------function for update / takeing of coins from wallet-------------------------------
const modalSub = (id) => {
    let found = false;
    for (let i = 0; i < newWalletArr.length; i++) {
        if (newWalletArr[i].id == id) {
            newWalletArr.splice(i, 1);
            found = true;
            break
        }
    }
    if (!found) {
        for (let i = 0; i < subArr.length; i++) {
            if (subArr[i].id == id) newWalletArr.push(subArr[i])
        }
    }  
}


//-------save changes in a new arr with map -----------------------------------
const saveChange = () => {
    $('.modal-body').html('');
    $('#myModal').modal('hide')
    newWalletArr.map(item => {
        $(`.${item.id}.toggle`)[0].checked = false;
        for (let i = 0; i < subArr.length; i++) {
            if (subArr[i].id == item.id) subArr.splice(i, 1);
        }
    });
    coinsIndex  -= newWalletArr.length;
    newWalletArr = [];
}


//----------------graph & update graph every 2's with set interval------------------
const startGraph = () => {
    //-------we put a function into the url--------
    let searchID = receiveID()
    chartInterval = setInterval(() => {
        $.ajax({
            url: `https://api.coingecko.com/api/v3/simple/price?ids=${searchID}&vs_currencies=usd`,
            success: function (data) {
                //we use Object for Provides functionality common to all JavaScript objects
                let resultArray = Object.values(data);
                let resultArrayKeys = Object.keys(data);
                if (resultArray.length > 0) {
               newData(resultArray, resultArrayKeys) }else{
                    $("#chartContainer").CanvasJSChart(graph);
                    loadingPage('done');
                }
            }
        });
    }, 2000);
}


//-------------getting new data for graph---------------------
const newData = (data, name) => {
    for (let i = 0; i < data.length; i++) {
        graph.data[i].name = name[i];
        graph.data[i].dataPoints.push({ x: seconds, y: data[i].usd });
    }
    $("#chartContainer").CanvasJSChart(graph);
    loadingPage('done')
    seconds += 2;
}


//----------function that receive ID for define URL--------------
const receiveID = () => {
    let addressID = '';
    subArr.forEach((item) => {
/*--%2C It's the ASCII keycode in hexadecimal for a comma (,).
You should use your language's URL encoding methods when placing strings in URLs. --*/
    addressID += `%2C${item.id}`
    });
    return addressID;
}


//------------- navigate on website navbar & clear interval ----------------
const navigateTo = (where) => {
    loadingPage()
    if (chartInterval){
        clearInterval(chartInterval);
    } 
    $('.parallax').hide()
    $("#chartContainer").empty().hide();
    $('#homeContainer').empty().hide();
    $('#aboutContainer').empty().hide();
    graph.data.forEach(item =>{
        item.name = '';
        item.dataPoints = [];

        //console.log(item.dataPoints)
    })

    //  validations navigate
    where === 'home' ? buildHome() : null;
    where === 'graphs' ? buildGraph() : null;
    where === 'about' ? buildAbout() : null;
}


//callback function for build page
const buildHome = () => {
    buildCard(allCoins, 100)
}

//callback function for build page
const buildGraph = () => {
    $("#chartContainer").show()
    seconds = 0;
    startGraph();
}


//-----------------------about page-----------------
const buildAbout = () => {
    $('#aboutContainer').html(`
    <div class='col-2 mt-5 about_img_wrapper'>
        <img src="./assets/stock-vector-cryptocurrency-logo-collected-the-main-1910148376.jpg" class="about_img mt-5 col-2"/>
    </div>
    <div class='about_info mt-5 col-10'>
    <h1>David Nezri</h1>
    <br>Crypto currency project, included with three pages,<br>

    • Home<br>
    
    Which includes 100 different loaded Crypto Currencies from an API which will be represnted as a card with toggles to keep track after the currency, and will have a drop down to view more information about the currency.<br>
    
    • Graphs<br>
    
    The page will display all the coins that the client subbed to (up to 5), it will update every 2 seconds.<br>
    
    • About<br>
    
    Just a generic about page<br>
    
    </div>
    `).show()
    loadingPage('done')
}
//------------gif loadingPage & validate----------------------
const  loadingPage = (status) => {
    status ? $('.popout').remove() : $('body').append('<div class="popout"><div class="loading-wrapper"><img src="assets/loading.gif" style=border-radius:100px ; class="loadimg-popout" alt=""></div></div>')
}
 



