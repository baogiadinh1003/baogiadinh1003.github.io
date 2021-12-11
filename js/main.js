var dataRenter;
var dataOwner;
var statusChart1 = false;
var statusChart2 = false;
var statusChart3 = false;
var statusChart4 = false;
var statusChart5 = false;
var dataPitch;
var dataAvgTotalPitchPerOwner;
var dataAvgTimeRentPitch;

$(document).ready(function() {
    // menu
    loadAvgTotalPitchPerOwner();
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

    $("#dashboard").click(function(e) {
        $(".dashboard-container").removeClass('d-none');
        $(".dashboard-container").addClass('d-flex');
        $(".account-container").addClass('d-none');
        $(".account-container").removeClass('d-flex');
        $(".pitch-container").addClass('d-none');
        $(".pitch-container").removeClass('d-flex');
    });

    $("#pitch").click(function(e) {
        $(".pitch-container").removeClass('d-none');
        $(".pitch-container").addClass('d-flex');
        $(".account-container").addClass('d-none');
        $(".account-container").removeClass('d-flex');
        $(".dashboard-container").addClass('d-none');
        $(".dashboard-container").removeClass('d-flex');
    });

    $("#accountList").click(function(e) {
        $(".account-container").removeClass('d-none');
        $(".account-container").addClass('d-flex');
        $(".dashboard-container").addClass('d-none');
        $(".dashboard-container").removeClass('d-flex');
        $(".pitch-container").addClass('d-none');
        $(".pitch-container").removeClass('d-flex');
    });

    $('#selectPitch2').change(function() {
        if ($("#selectPitch2").val() == 'avgTotalPitchPerOwner') {
            $("#chartAvgTimeRentPitch").addClass('d-none');
            $("#chartAvgTotalPitchPerOwner").removeClass('d-none');
            if (dataAvgTotalPitchPerOwner === null || dataAvgTotalPitchPerOwner === undefined) {
                loadAvgTotalPitchPerOwner();
            }
        }
        if ($("#selectPitch2").val() == 'avgTimeRentPitch') {
            $("#chartAvgTotalPitchPerOwner").addClass('d-none');
            $("#chartAvgTimeRentPitch").removeClass('d-none');
            if (dataAvgTimeRentPitch === null || dataAvgTimeRentPitch === undefined) {
                loadAvgTimeRentPitch();
            }
        }
    });
});

async function loadAccountData() {
    await $.ajax({
        type: "GET",
        url: "https://we-sports-sv.herokuapp.com/v1/renter/list",
        contentType: "application/json",
        success: function(result) {
            var dum = result;
            dataRenter = dum.data;
        }
    })

    await $.ajax({
        type: "GET",
        url: "https://we-sports-sv.herokuapp.com/v1/owner/list",
        contentType: "application/json",
        success: function(result) {
            var dum = result;
            dataOwner = dum.data;
        }
    })
    var countRenter = dataRenter.length;
    var countOwner = dataOwner.length;
    if (statusChart1 === false) {
        var ctx = document.getElementById('chart').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Tổng', 'Người thuê', 'Người cho thuê'],
                datasets: [{
                    label: 'Số lượng',
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
        statusChart1 = true;
    }
}

async function loadPitchDataCity() {
    await $.ajax({
        type: "POST",
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

    if (statusChart2 === false) {
        var canvas = document.getElementById('chartPitch');
        var ctx = canvas.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: addressFilter,
                datasets: [{
                    label: 'Số lượng',
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
        statusChart2 = true;
    }

}

async function loadPitchDataAvgPrice() {
    await $.ajax({
        type: "POST",
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

    if (statusChart3 === false) {
        var canvas = document.getElementById('chartPitchAvg');
        var ctx = canvas.getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Sân trên giá trung bình', 'Sân dưới giá trung bình', 'Sân giá trung bình'],
                datasets: [{
                    label: 'Số lượng',
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
        statusChart3 = true;
    }

}

async function loadAvgTotalPitchPerOwner() {
    await $.ajax({
        type: "POST",
        url: "https://we-sports-sv.herokuapp.com/v1/pitch/list",
        contentType: "application/json",
        dataType: 'json',
        success: function(result) {
            var dum = result;
            dataAvgTotalPitchPerOwner = dum.data;
        }
    })

    var ownersId = [];
    var ownersName = ['Trung bình'];
    for (let index = 0; index < dataAvgTotalPitchPerOwner.length; index++) {
        var element = dataAvgTotalPitchPerOwner[index];
        if (ownersId.indexOf(element.pitchOwner._id) !== -1) {
            continue;
        }
        ownersId.push(element.pitchOwner._id)
        ownersName.push(element.pitchOwner.ownerName)
    }

    var countPitch = [0];
    var avg = 0;
    for (let index = 0; index < ownersId.length; index++) {
        const element = ownersId[index];
        data = { pitchOwner: element };
        await $.ajax({
            type: "POST",
            url: "https://we-sports-sv.herokuapp.com/v1/pitch/listbyowner",
            data: JSON.stringify(data),
            contentType: "application/json",
            success: function(result) {
                avg += result.data.length;
                countPitch.push(result.data.length);
            }
        })
    }

    avg = avg / ownersId.length;
    countPitch[0] = avg;
    var max = Math.max.apply(Math, countPitch);
    var min = Math.min.apply(Math, countPitch);
    var indexOfMax = countPitch.indexOf(max);
    var indexOfMin = countPitch.indexOf(min);

    if (statusChart4 === false) {
        var ctx = document.getElementById('chartAvgTotalPitchPerOwner').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [ownersName[0], "Người nhiều sân nhất: " + ownersName[indexOfMax], "Người ít sân nhất: " + ownersName[indexOfMin]],
                datasets: [{
                    label: 'Số lượng sân',
                    data: [countPitch[0], countPitch[indexOfMax], countPitch[indexOfMin]],
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
                        text: 'Thống kê sân',
                        position: 'bottom'
                    }
                }

            }
        });
        statusChart4 = true;
    }
}

async function loadAvgTimeRentPitch() {
    await $.ajax({
        type: "GET",
        url: "https://we-sports-sv.herokuapp.com/v1/bill/list",
        contentType: "application/json",
        success: function(result) {
            var dum = result;
            dataAvgTotalPitchPerOwner = dum.data;
        }
    })

    var timeRent = [];
    var countTime = [];
    for (let index = 0; index < dataAvgTotalPitchPerOwner.length; index++) {
        const element = dataAvgTotalPitchPerOwner[index];
        for (let j = 0; j < element.timeRent.length; j++) {
            const elm = element.timeRent[j];
            var text;
            if (elm.substring(0, 2).includes(':')) {
                text = elm.replace(elm.substring(0, 1), 0 + elm.substring(0, 1))
            } else {
                text = elm;
            }
            if (timeRent.indexOf(text) !== -1) {
                countTime[timeRent.indexOf(text)] = countTime[timeRent.indexOf(text)] + 1;
                continue;
            }
            timeRent.push(text);
            countTime.push(1);
        }
    }

    if (statusChart5 === false) {
        var ctx = document.getElementById('chartAvgTimeRentPitch').getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: timeRent,
                datasets: [{
                    label: 'Số lượt thuê',
                    data: countTime,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(132, 220, 198, 0.2)',
                        'rgba(165, 255, 214, 0.2)',
                        'rgba(255, 166, 158, 0.2)',
                        'rgba(255, 104, 107, 0.2)',
                        'rgba(232, 141, 103, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(132, 220, 198, 1)',
                        'rgba(165, 255, 214, 1)',
                        'rgba(255, 166, 158, 1)',
                        'rgba(255, 104, 107, 1)',
                        'rgba(232, 141, 103, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                aspectRatio: 2.2,
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    title: {
                        display: true,
                        text: 'Thống kê giờ trong ngày được thuê',
                        position: 'bottom'
                    }
                }

            }
        });
        statusChart5 = true;
    }

}