queue()
    .defer(d3.csv, "data/budget.csv")
    .await(drawGraphs);

function drawGraphs(error, budgetData) {
    var ndx = crossfilter(budgetData);

    show_month_selector(ndx);
    show_income_category_piechart(ndx);
    show_spend_category_piechart(ndx);
    show_category_distribution(ndx);
    show_balance_linechart(error, budgetData, ndx);

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

    var categoriesColors = d3.scale.ordinal()
        .domain(["Income (active)", "Income (passive)"])
        .range(["#1E90FF", "#A9A9A9"]);


    dc.pieChart('#pie_income')
        .height(200)
        .radius(150)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group)
        .colors(categoriesColors);
}

function show_spend_category_piechart(ndx) {
    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('debit amount'));

    var categoriesColors = d3.scale.ordinal()
        .domain(["Savings", "Going Out", "Healthcare", "Rent", "Transport", "Clothing", "Groceries", "Bills", "Entertainment", "Others", "Coffee"])
        .range(["#228B22", "#8B008B", "#00FF00", "#FF0000", "#FF4500", "#00CED1", "#FFD700", "#8B0000", "#4B0082", "#C0C0C0", "#D2691E"]);


    dc.pieChart('#pie_expenses_category')
        .height(200)
        .radius(150)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group)
        .colors(categoriesColors);
}

function show_category_distribution(ndx) {
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
    
    dc.barChart("#category_stackbarchart")
        .width(600)
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
        .legend(dc.legend().x(620).y(20).itemHeight(10).gap(10))
        .colors(categoriesColors)
        .margins({ top: 10, right: 100, bottom: 30, left: 30 });
}

function show_balance_linechart(error, budgetData, ndx) {
    var parseDate = d3.time.format("%d/%m/%Y").parse;
    budgetData.forEach(function(d) {
        d.date = parseDate(d.date);
    });
    var date_dim = ndx.dimension(dc.pluck('date'));
    var balance_per_date = date_dim.group().reduceSum(dc.pluck('balance'));
    var minDate = date_dim.bottom(1)[0].date;
    var maxDate = date_dim.top(1)[0].date;
    dc.lineChart("#balance_linechart")
        .width(600)
        .height(300)
        .margins({ top: 10, right: 50, bottom: 30, left: 50 })
        .dimension(date_dim)
        .group(balance_per_date)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Month")
        .yAxis().ticks(4);
}
