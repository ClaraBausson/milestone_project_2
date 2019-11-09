queue()
    .defer(d3.csv, "data/budget.csv")
    .await(drawGraphs);

function drawGraphs(error, budgetData) {
    var ndx = crossfilter(budgetData);

    show_month_selector(ndx);
    show_income_category_piechart(ndx);
    show_spend_category_piechart(ndx);
    show_category_distribution(ndx);
    balance_linechart(error, budgetData, ndx);
    
    dc.renderAll();
}

function show_month_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('month'));
    var group = dim.group();

    dc.selectMenu("#month_selector")
        .dimension(dim)
        .group(group);
}

function show_income_category_piechart(ndx) {
    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('credit amount'));

    dc.pieChart('#pie_income')
        .height(200)
        .radius(150)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group);
}

function show_spend_category_piechart(ndx) {
    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('debit amount'));

    dc.pieChart('#pie_expenses_category')
        .height(200)
        .radius(150)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group);
}

function show_category_distribution(ndx) {

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

    var dim = ndx.dimension(dc.pluck("month"));
    var savingsByMonth = categoryByMonth(dim, "Savings");
    var goingOutByMonth = categoryByMonth(dim, "Going Out");
    var healthcareByMonth = categoryByMonth(dim, "Healthcare");
    var rentByMonth = categoryByMonth(dim, "Rent");
    var transportByMonth = categoryByMonth(dim, "Transport");
    var clothingByMonth = categoryByMonth(dim, "Clothing");
    var groceriesByMonth = categoryByMonth(dim, "Groceries");
    var billsByMonth = categoryByMonth(dim, "Bills");
    var entertainmentByMonth = categoryByMonth(dim, "Entertainment");
    var othersByMonth = categoryByMonth(dim, "Others");
    var coffeeByMonth = categoryByMonth(dim, "Coffee");

    dc.barChart("#category-distribution")
        .width(450)
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
        .legend(dc.legend().x(350).y(20).itemHeight(10).gap(10))
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}

function balance_linechart(error, budgetData, ndx) {
    var parseDate = d3.time.format("%d/%m/%Y").parse;
    budgetData.forEach(function(d) {
        d.date = parseDate(d.date);
    });
    var date_dim = ndx.dimension(dc.pluck('date'));
    var balance_per_date = date_dim.group().reduceSum(dc.pluck('balance'));
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    dc.lineChart("#chart-here")
        .width(1000)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(date_dim)
        .group(balance_per_date)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Month")
        .yAxis().ticks(4);
}