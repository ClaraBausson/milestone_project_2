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

    dc.barChart("#number_of_transactions")
        .width(300)
        .height(250)
        .margins({ top: 15, right: 50, bottom: 30, left: 50 })
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .colors('#DEA5A4')
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
        .range(["#a9cbd7", "#d7d7d1"]);


    chart
        .width(600)
        .height(400)
        .transitionDuration(500)
        .dimension(dim)
        .group(group)
        .colors(categoriesColors)
        .renderLabel(true)
        .minAngleForLabel(0.2)
        .innerRadius(50)
        .externalLabels(40)
        .externalRadiusPadding(50)
        .drawPaths(true)
        .emptyTitle("No data")
        .useViewBoxResizing(true);

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
        .range(["#95FF91", "#B34280", "#baffc9", "#ffb3ba", "#ffdfba", "#5E98B3", "#ffffba", "#ff6961", "#bae1ff", "#cfcfc4", "#ebbf8b"]);


    chart
        .width(600)
        .height(400)
        .transitionDuration(500)
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
        .useViewBoxResizing(true);

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
        .range(["#95FF91", "#B34280", "#baffc9", "#ffb3ba", "#ffdfba", "#5E98B3", "#ffffba", "#ff6961", "#bae1ff", "#cfcfc4", "#ebbf8b"]);

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
        .transitionDuration(500)
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
        .margins({ top: 20, right: 130, bottom: 50, left: 50 })
        .elasticY(true)
        .useViewBoxResizing(true);
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
        .height(400)
        .transitionDuration(500)
        .margins({ top: 10, right: 0, bottom: 50, left: 50 })
        .clipPadding(0)
        .dimension(date_dim)
        .group(balance_per_date)
        .colors('#966FB6')
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .renderArea(false)
        .brushOn(false)
        .renderDataPoints({ radius: 2.2, fillOpacity: 0.8, strokeOpacity: 0.9 })
        .renderHorizontalGridLines(true)
        .yAxis().ticks(4);
}