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
    show_balance_barchart(error, budgetData, ndx);

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
        .numberVisible(13);
}

function show_income_category_piechart(ndx) {
    var chart = dc.pieChart('#pie_income');
    
    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('credit amount'));

    var categoriesColors = d3.scale.ordinal()
        .domain(["Income (active)", "Income (passive)"])
        .range(["#1E90FF", "#A9A9A9"]);


    chart
        .width(500)
        .height(350)
        .transitionDuration(800)
        .dimension(dim)
        .group(group)
        .colors(categoriesColors)
        .renderLabel(true)
        .innerRadius(50)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true);

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
    var group = dim.group().reduceSum(dc.pluck('debit amount'));

    var categoriesColors = d3.scale.ordinal()
        .domain(["Savings", "Going Out", "Healthcare", "Rent", "Transport", "Clothing", "Groceries", "Bills", "Entertainment", "Others", "Coffee"])
        .range(["#228B22", "#8B008B", "#00FF00", "#FF0000", "#FF4500", "#00CED1", "#FFD700", "#8B0000", "#4B0082", "#C0C0C0", "#D2691E"]);
        

    chart
        .width(500)
        .height(350)
        .transitionDuration(800)
        .dimension(dim)
        .group(group)
        .colors(categoriesColors)
        .renderLabel(true)
        .innerRadius(50)
        .externalLabels(50)
        .externalRadiusPadding(50)
        .drawPaths(true);

    chart.on('pretransition', function(chart) {
        chart.selectAll('.dc-legend-item text')
            .text('')
            .append('tspan')
            .text(function(d) { return d.name; })
            .append('tspan')
            .attr('x', 500)
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
        .width(650)
        .height(300)
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
        .legend(dc.legend().x(0).y(20).itemHeight(10).gap(10))
        .colors(categoriesColors)
        .margins({ left: 150, top: 20, right: 0, bottom: 50 })
        .elasticY(true);
}

function show_balance_linechart(error, budgetData, ndx) {
    var chart = dc.lineChart("#balance_linechart");
    
    var parseDate = d3.time.format("%d/%m/%Y").parse;
    budgetData.forEach(function(d) {
        d.date = parseDate(d.date);
    });
    var date_dim = ndx.dimension(dc.pluck('date'));
    var balance_per_date = date_dim.group().reduceSum(dc.pluck('balance'));
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    
    chart
        .width(650)
        .height(300)
        .margins({ top: 10, right: 0, bottom: 50, left: 50 })
        .dimension(date_dim)
        .group(balance_per_date)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .renderArea(false)
        .brushOn(false)
        .renderDataPoints({ radius: 2.2, fillOpacity: 0.8, strokeOpacity: 0.9 })
        .yAxis().ticks(4);
}
