queue()
    .defer(d3.csv, "data/budget.csv")
    .await(drawGraphs);

function drawGraphs(error, budgetData) {
    var ndx = crossfilter(budgetData);

    show_month_selector(ndx);
    show_income_category_piechart(ndx);
    show_spend_category_piechart(ndx);
    show_category_stackchart(ndx);
    show_balance_linechart(error, budgetData, ndx);
    show_number_transactions_barchart(ndx);
    // trial_filter_out_from_group(ndx);

    dc.renderAll();
}

// // DATA
// // #,date,month,type,category,debit_amount,credit_amount,balance
// // 1,02/01/2018,January,debit,Savings,1.16,,389.43
// // 2,02/01/2018,January,debit,Savings,100,,289.43
// // 3,02/01/2018,January,debit,Bills,20.52,,268.91
// // 4,02/01/2018,January,credit,Income (passive),,1.58,270.49

// function trial_filter_out_from_group(ndx) {
//     var dim = ndx.dimension(dc.pluck('category'));
//     var group = dim.group();

//     var array = [
//         { "id": "88", "name": "Lets go testing" },
//         { "id": "99", "name": "Have fun boys and girls" },
//         { "id": "108", "name": "You are awesome!" }
//     ];
//     var search_column = 'id';
//     var search_term = '99';

//     console.log(array);

//     function filterOut2(array, search_column, search_term) {
//         for (var i = array.length - 1; i >= 0; i--) {
//             if (array[i].search_column === search_term) {
//                 array.splice(i, 1);
//                 console.log(array);
//             }
//         }
//     }

//     var newArray = filterOut2(array, search_column, search_term);
//     console.log(newArray);

// }

function show_month_selector(ndx) {

    var dim = ndx.dimension(dc.pluck('month'));
    var group = dim.group();

    dc.selectMenu("#month_selector")
        .dimension(dim)
        .group(group)
        .multiple(true)
        .promptText('All months')
        .numberVisible(5);
}

function show_number_transactions_barchart(ndx) {
    var dim = ndx.dimension(dc.pluck('type'));
    var group = dim.group();

    var categoriesColors = d3.scale.ordinal()
        .domain(["credit", "debit"])
        .range(["blue", "red"]);

    dc.barChart("#number_of_transactions")
        .width(350)
        .height(350)
        .margins({ top: 15, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .colors(categoriesColors)
        .transitionDuration(500)
        .xAxisLabel('Type of transaction')
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel('Number of transactions')
        .y(d3.scale.linear().domain([0, 1550]))
        .elasticY(false)
        .renderLabel(true);
}

function show_income_category_piechart(ndx) {
    var chart = dc.pieChart('#pie_income');

    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('credit_amount'));

    var categoriesColors = d3.scale.ordinal()
        .domain(["Income (active)", "Income (passive)"])
        .range(["#1E90FF", "#A9A9A9"]);


    chart
        .width(600)
        .height(400)
        .transitionDuration(800)
        .dimension(dim)
        .group(group)
        .colors(categoriesColors)
        .renderLabel(true)
        .minAngleForLabel(0.2)
        .innerRadius(50)
        .externalLabels(40)
        .externalRadiusPadding(50)
        .drawPaths(true)
        .emptyTitle("No data");

    chart.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
            .text('')
            .append('tspan')
            .text(function(d) { return d.name; })
            .append('tspan')
            .attr('x', 50)
            .attr('text-anchor', 'end')
            .text(function(d) { return d.data; });
    });
}

function show_spend_category_piechart(ndx) {
    var chart = dc.pieChart('#pie_expenses_category');

    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('debit_amount'));

    var categoriesColors = d3.scale.ordinal()
        .domain(["Savings", "Going Out", "Healthcare", "Rent", "Transport", "Clothing", "Groceries", "Bills", "Entertainment", "Others", "Coffee"])
        .range(["#228B22", "#8B008B", "#00FF00", "#FF0000", "#FF4500", "#00CED1", "#FFD700", "#8B0000", "#4B0082", "#C0C0C0", "#D2691E"]);


    chart
        .width(600)
        .height(400)
        .transitionDuration(800)
        .dimension(dim)
        .group(group)
        .colors(categoriesColors)
        .renderLabel(true)
        .minAngleForLabel(0.2)
        .innerRadius(50)
        .externalLabels(40)
        .externalRadiusPadding(60)
        .radius(250)
        .drawPaths(true)
        .emptyTitle("No data");

    chart.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
            .text('')
            .append('tspan')
            .text(function(d) { return d.name; })
            .append('tspan')
            .attr('x', 50)
            .attr('text-anchor', 'end')
            .text(function(d) { return d.data; });
    });
}

function show_category_stackchart(ndx) {
    var chart = dc.barChart("#category_stackbarchart")

    var dim = ndx.dimension(dc.pluck('month'));

    var categoriesColors = d3.scale.ordinal()
        .domain(["Savings", "Going Out", "Healthcare", "Rent", "Transport", "Clothing", "Groceries", "Bills", "Entertainment", "Others", "Coffee"])
        .range(["#228B22", "#8B008B", "#00FF00", "#FF0000", "#FF4500", "#00CED1", "#FFD700", "#8B0000", "#4B0082", "#C0C0C0", "#D2691E"]);

    function categoryByMonth(dimension, category) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.category == category) {
                    p.match++;
                }
                return p;
            },
            function(p, v) {
                p.total--;
                if (v.category == category) {
                    p.match--;
                }
                return p;
            },
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

    var rentByMonth = categoryByMonth(dim, "Rent");
    var billsByMonth = categoryByMonth(dim, "Bills");
    var transportByMonth = categoryByMonth(dim, "Transport");
    var healthcareByMonth = categoryByMonth(dim, "Healthcare");
    var groceriesByMonth = categoryByMonth(dim, "Groceries");
    var goingOutByMonth = categoryByMonth(dim, "Going Out");
    var coffeeByMonth = categoryByMonth(dim, "Coffee");
    var entertainmentByMonth = categoryByMonth(dim, "Entertainment");
    var clothingByMonth = categoryByMonth(dim, "Clothing");
    var othersByMonth = categoryByMonth(dim, "Others");
    var savingsByMonth = categoryByMonth(dim, "Savings");

    chart
        .width(700)
        .height(400)
        .dimension(dim)
        .group(rentByMonth, "Rent")
        .stack(billsByMonth, "Bills")
        .stack(transportByMonth, "Transport")
        .stack(healthcareByMonth, "Healthcare")
        .stack(groceriesByMonth, "Groceries")
        .stack(goingOutByMonth, "Going Out")
        .stack(coffeeByMonth, "Coffee")
        .stack(entertainmentByMonth, "Entertainment")
        .stack(clothingByMonth, "Clothing")
        .stack(othersByMonth, "Others")
        .stack(savingsByMonth, "Savings")
        .valueAccessor(function(d) {
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .yAxisLabel('Expenses per month (in %)')
        .legend(dc.legend().x(600).y(20).itemHeight(10).gap(10))
        .colors(categoriesColors)
        .margins({top: 20, right: 130, bottom: 50, left: 50})
        .elasticY(true);
}

function show_balance_linechart(error, budgetData, ndx) {
    var chart = dc.lineChart("#balance_linechart");

    var parseDate = d3.time.format("%d/%m/%Y").parse;
    budgetData.forEach(function(d) {
        d.date = parseDate(d.date);
    });

    var date_dim = ndx.dimension(dc.pluck('date'));
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;

    var balance_per_date = date_dim.group().reduceSum(dc.pluck('balance'));

    chart
        .width(700)
        .height(400)
        .margins({ top: 10, right: 0, bottom: 50, left: 50 })
        .dimension(date_dim)
        .group(balance_per_date)
        .colors('MidnightBlue')
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .renderArea(false)
        .brushOn(false)
        .renderDataPoints({ radius: 2.2, fillOpacity: 0.8, strokeOpacity: 0.9 })
        .yAxis().ticks(4);
}
