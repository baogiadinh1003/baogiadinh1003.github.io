var dashboardAction = true;
var pitchAction = false;
var accountListAccount = false;
var dashboardHtml = './dashboard.html';
var dataRenter;
var dataOwner;
var dataPitch;

$(document).ready(function() {
    // menu
    loadAccountData();
    if ($("#selectPitch").val() == 'city') {
        loadPitchDataCity();
    }
    if ($("#selectPitch").val() == 'avgPrice') {
        loadPitchDataAvgPrice();
    }

    $('#selectPitch').change(function() {
        if ($("#selectPitch").val() == 'city') {
            $("#chartPitchAvg").addClass('d-none');
            $("#chartPitch").removeClass('d-none');
            loadPitchDataCity();
        }
        if ($("#selectPitch").val() == 'avgPrice') {
            $("#chartPitch").addClass('d-none');
            $("#chartPitchAvg").removeClass('d-none');
            loadPitchDataAvgPrice();
        }
    });
});

async function loadAccountData() {
    await $.ajax({
        method: "GET",
        url: "https://we-sports-sv.herokuapp.com/v1/renter/list",
        contentType: "application/json",
        success: function(result) {
            var dum = result;
            dataRenter = dum.data;
        }
    })

    await $.ajax({
        method: "GET",
        url: "https://we-sports-sv.herokuapp.com/v1/owner/list",
        contentType: "application/json",
        success: function(result) {
            var dum = result;
            dataOwner = dum.data;
        }
    })
    var countRenter = dataRenter.length;
    var countOwner = dataOwner.length;
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Tổng', 'Người thuê', 'Người cho thuê'],
            datasets: [{
                label: 'Quantily',
                data: [Number(countRenter) + Number(countOwner), countRenter, countOwner],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Thống kê người dùng',
                    position: 'bottom'
                }
            }

        }
    });
}

async function loadPitchDataCity() {

    await $.ajax({
        method: "POST",
        url: "https://we-sports-sv.herokuapp.com/v1/pitch/list",
        contentType: "application/json",
        success: function(result) {
            var dum = result;
            dataPitch = dum.data;
        }
    })

    var addressCodeFilter = [];
    var addressFilter = ["Tổng"];
    var countPitch = [dataPitch.length];
    for (i = 0; i < dataPitch.length; i++) {
        var dumPitch = dataPitch[i];
        var addressCode = dumPitch.pitchAddress.addressCity.code;
        if (addressCodeFilter.indexOf(addressCode) !== -1) {
            continue;
        }
        addressCodeFilter.push(addressCode);
        addressFilter.push(dumPitch.pitchAddress.addressCity.name);
    }

    for (i = 0; i < addressCodeFilter.length; i++) {
        var count = 0;
        for (j = 0; j < dataPitch.length; j++) {
            var dumPitch = dataPitch[j];
            if (addressCodeFilter[i] == dumPitch.pitchAddress.addressCity.code) {
                count++
            }
        }
        countPitch.push(count);
    }

    var canvas = document.getElementById('chartPitch');
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: addressFilter,
            datasets: [{
                label: 'Quantily',
                data: countPitch,
                backgroundColor: [
                    'rgba(79, 192, 192, 0.2)',
                    'rgba(255, 203, 98, 0.2)',
                ],
                borderColor: [
                    'rgba(79, 192, 192, 1)',
                    'rgba(255, 203, 98, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Thống kê sân theo tỉnh, thành phố',
                    position: 'bottom'
                }
            }

        }
    });
}

async function loadPitchDataAvgPrice() {
    await $.ajax({
        method: "POST",
        url: "https://we-sports-sv.herokuapp.com/v1/pitch/list",
        contentType: "application/json",
        success: function(result) {
            var dum = result;
            dataPitch = dum.data;
        }
    })

    var avgPrice = 0;
    var countPitch = dataPitch.length;
    var total = 0;
    for (i = 0; i < dataPitch.length; i++) {
        var dumPitch = dataPitch[i];
        var avgPerPitch = (Number(dumPitch.minPrice) + Number(dumPitch.maxPrice)) / 2
        total += avgPerPitch;
    }

    avgPrice = total / countPitch;
    avgPrice = Math.round(avgPrice)

    var overAvg = 0;
    var underAvg = 0;
    var isAvg = 0;
    for (i = 0; i < dataPitch.length; i++) {
        var dumPitch = dataPitch[i];
        var avgPitch = (Number(dumPitch.minPrice) + Number(dumPitch.maxPrice)) / 2
        if (Number(avgPrice) > Number(avgPitch)) {
            underAvg++;
        }
        if (Number(avgPrice) == Number(avgPitch)) {
            isAvg++;
        }
        if (Number(avgPrice) < Number(avgPitch)) {
            overAvg++;
        }
    }

    var canvas = document.getElementById('chartPitchAvg');
    var ctx = canvas.getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sân trên giá trung bình', 'Sân dưới giá trung bình', 'Sân giá trung bình'],
            datasets: [{
                label: 'Quantily',
                data: [overAvg, underAvg, isAvg],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(79, 192, 192, 0.2)',
                    'rgba(255, 203, 98, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(79, 192, 192, 1)',
                    'rgba(255, 203, 98, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: `Thống kê sân theo giá trung bình (${avgPrice})`,
                    position: 'bottom'
                }
            }

        }
    });
}