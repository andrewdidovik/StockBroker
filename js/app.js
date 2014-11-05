var App = {};

App.CURR = {};

/**/

App.CURR.EUR = {name: 'EUR', bits: 12.7, vector: 'up', step: 0.03, symbol: '&euro;'};
App.CURR.USD = {name: 'USD', bits: 10,   vector: 'up', step: 0.05, symbol: '$'};
App.CURR.BIT = {name: 'BIT', bits: 1};

App.CURR.text = 'Валютные торги';

App.SPACE = App.CURR;

//App.HOURS = [];

App.currentTime = 9;
App.timeStep    = 0.5;
App.delta       = 0.005;

var now = new Date();
App.userDate    = {
    year: now.getUTCFullYear(),
    month: now.getUTCMonth(),
    day: now.getUTCDate() 
}




App.currency = App.CURR.BIT;

App.CURR.get = function(field){
    
    for (var i in App.CURR){
        
        if (i == field)
            return App.CURR[i];
    }
}

function ticTac(){
    
    App.myInterval = setInterval(function(){
       
        stepChange(App.currentTime);

    }, 6*1000)


}

function stepChange(curr_time){
    
    switch(curr_time){

        case 11:
            App.CURR.EUR.step += App.delta;
            App.CURR.USD.step += App.delta;
           
        break;

        case 12:
            App.CURR.EUR.vector = 'down';
            App.CURR.USD.vector = 'down';
            
        break;

        case 13:
            App.CURR.EUR.step = 0;
            App.CURR.USD.step = 0;
            
        break;

        case 15:
            App.CURR.EUR.step = App.delta;
            App.CURR.USD.step = App.delta; 

            App.CURR.EUR.vector = 'up';
            App.CURR.USD.vector = 'up';
            
        break;

        case 16:
            App.CURR.EUR.step = App.delta;
            App.CURR.USD.step = App.delta; 

            App.CURR.EUR.vector = 'down';
            App.CURR.USD.vector = 'down';
            
        break;

        case 17:
            clearInterval(App.myInterval);
           
        break;

        default:
            
        break;

    }

    billChange();
}

function billChange(){
    App.currentTime += App.timeStep;

    App.CURR.USD.bits += (App.CURR.USD.vector == 'up') ? App.CURR.USD.step : -App.CURR.USD.step; 
    App.CURR.EUR.bits += (App.CURR.EUR.vector == 'up') ? App.CURR.EUR.step : -App.CURR.EUR.step;

    App.chart_current.series[0].addPoint(App.CURR.EUR.bits, true);
    App.chart_current.series[1].addPoint(App.CURR.USD.bits, true);
}


App.chart_model = {
        chart: {
            renderTo: 'container',
            type: 'spline',
            animation: Highcharts.svg,
            events: {
                load: ticTac()
            },
            zoomType: 'x'
        },

        title: {
            text: App.SPACE.text
        },

        xAxis: {
            type: 'datetime',
            minRange: 1800 * 1000, // half of hour
            gridLineWidth: 1,
            
            // dateTimeLabelFormats: {
            //    hour: '%H:%M'
            // }
            //min: 900 * 1000,
            //max: 17
            //categories: ['9','10']//['9.00', '9.30', '10.00', '10.30', '11.00', '11.30', '12.00', '12.30', '13.00', '13.30', '14.00', '14.30', '15.00', '15.30', '16.00', '16.30', '17.00']

        },

        yAxis: {
            title: {text: App.currency.name},
            min : 9.5,
            // max : 13,
            //tickInterval:0.1,
            plotLines:
                    [{
                        value:12.7,
                        color: '#ff0000',
                        width:1,
                        zIndex:4,
                        // label:
                        // {
                        //     text:'EUR start point',
                        //     style:
                        //     {
                        //         fontSize: 10
                        //     },
                        //     x: 0
                        // }
                    },
                    {
                        value:10,
                        color: '#ff0000',
                        width:1,
                        zIndex:4,
                        // label:
                        // {
                        //     text:'USD start point',
                        //     style:
                        //     {
                        //         fontSize: 10
                        //     },
                        //     x: 0
                        // }
                    }] 
        },

        series: [
        {
            data: [App.CURR.EUR.bits],
            pointStart: Date.UTC(App.userDate.year, App.userDate.month, App.userDate.day, 9, 0),
            pointInterval: 1800 * 1000, // half of hour
            name: App.CURR.EUR.name,
            lineWidth: 2,
            marker: {
                    radius: 2
                }
        },
        {
            data: [App.CURR.USD.bits],
            pointStart: Date.UTC(App.userDate.year, App.userDate.month, App.userDate.day, 9, 0),
            pointInterval: 1800 * 1000, // half of hour
            name: App.CURR.USD.name,
            color: '#30BB41',
            lineWidth: 2,
            marker: {
                    radius: 2
                }
        },
        {
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            pointStart: Date.UTC(App.userDate.year, App.userDate.month, App.userDate.day, 13),
            pointInterval: 900 * 1000, // half of hour
            name: ' ',
            color: 'rgba(0,0,0,0)'
        }
        ],

        legend: {
            layout: 'horizontal',
            backgroundColor: '#FFFFFF',
            floating: true,
            align: 'right',
            verticalAlign: 'top',
        }

    }






// App.events = [{
//     e_target:  '.currency_change',
//     e_action:   'click',
//     e_callback: App.currency_change
// }];


App.currency_change = function(){
    $('header li.currency_change').removeClass('active');
    $(this).addClass('active');
   
    App.currency = App.CURR.get($(this).attr('id'));
    App.chart_model.yAxis.title.text = App.currency.name;
    delete App.chart_current;
    App.chart_current = new Highcharts.Chart(App.chart_model);

}


$(function() {
    Highcharts.setOptions({
        chart: {
            backgroundColor: {
                linearGradient: [0, 0, 500, 500],
                stops: [
                    [0, 'rgb(255, 255, 255)'],
                    [1, 'rgb(240, 240, 255)']
                    ]
            },
            borderWidth: 2,
            plotBackgroundColor: 'rgba(255, 255, 255, .9)',
            plotShadow: true,
            plotBorderWidth: 1
        }
    });
    
    App.chart_current = new Highcharts.Chart(App.chart_model);
  
    /*add events*/
    $('header').on('click','li.currency_change', App.currency_change);

    $('body').on('click','button[data-target]', function(){
      
        var name = $(this).text();

        $('#sellModalLabel').text(name);
    });

    $('body').on('click','button[data-type]', function(){
        $('button[data-type]').removeClass('active');
        $(this).addClass('active');

        var val = $(this).data('type');
        var symbol = $('body span.symbol');

        if(val == "USD"){
            symbol.text(App.CURR.USD.symbol);
        }
        else if(val == "EUR"){
            symbol.html(App.CURR.EUR.symbol);
        }

    });

    $('body').on('click','button#doIt', function(){
        var val = $('#currency_sum').val();
        console.log(val)
    });

    // var chart2 = new Highcharts.Chart({
    //     chart: {
    //         renderTo: 'container',
    //         type: 'column'
    //     },

    //     xAxis: {
    //         type: 'datetime'
    //     },

    //     series: [{
    //         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
    //         pointStart: Date.UTC(2010, 0, 1),
    //         pointInterval: 3600 * 1000 // one hour
    //     }]
    // });
});