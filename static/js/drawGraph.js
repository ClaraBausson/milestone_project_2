queue()
    .defer(d3.csv, "data/budget.csv")
    .await(drawGraphs);

function drawGraphs(error, budgetData) {
    var ndx = crossfilter(budgetData);

    show_month_selector(ndx);
<<<<<<< HEAD
    show_income_category_piechart(ndx);
    show_spend_category_piechart(ndx);
    show_category_distribution(ndx);
    balance_linechart(error, budgetData, ndx);
    
=======
    show_spend_category_piechart(ndx);
    show_income_category_piechart(ndx);
    show_category_distribution(ndx);

>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
    dc.renderAll();
}

function show_month_selector(ndx) {
    var dim = ndx.dimension(dc.pluck('month'));
    var group = dim.group();
<<<<<<< HEAD

    dc.selectMenu("#month_selector")
=======
    
    dc.selectMenu("#month-selector")
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
        .dimension(dim)
        .group(group);
}

<<<<<<< HEAD
function show_income_category_piechart(ndx) {
=======
function show_spend_category_piechart(ndx) {
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
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

<<<<<<< HEAD
function show_category_distribution(ndx) {

    function categoryByMonth(dimension, category) {
        return dimension.group().reduce(
            function(p, v) {
                p.total++;
                if (v.category == category) {
=======


function show_category_distribution(ndx) {
    
    function categoryByMonth(dimension, category) {
        return dimension.group().reduce(
            function (p, v) {
                p.total++;
                if(v.category == category) {
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
                    p.match++;
                }
                return p;
            },
<<<<<<< HEAD
            function(p, v) {
                p.total--;
                if (v.category == category) {
=======
            function (p, v) {
                p.total--;
                if(v.category == category) {
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
                    p.match--;
                }
                return p;
            },
<<<<<<< HEAD
            function() {
                return { total: 0, match: 0 };
            }
        );
    }

=======
            function () {
                return {total: 0, match: 0};
            }
        );
    }
    
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
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
<<<<<<< HEAD

=======
    
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
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
<<<<<<< HEAD
            if (d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            }
            else {
=======
            if(d.value.total > 0) {
                return (d.value.match / d.value.total) * 100;
            } else {
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
                return 0;
            }
        })
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .legend(dc.legend().x(350).y(20).itemHeight(10).gap(10))
<<<<<<< HEAD
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
=======
        .margins({top: 10, right: 100, bottom: 30, left: 30});
}
>>>>>>> 14e9bf1f8b476545d09e05dc211723ad21f451cf
