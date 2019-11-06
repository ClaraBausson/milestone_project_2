queue()
    .defer(d3.csv, "data/budget.csv")
    .await(drawGraphs);

function drawGraphs(error, budgetData) {
    var ndx = crossfilter(budgetData);

    show_spend_category_piechart(ndx);
    show_income_category_piechart(ndx);

    dc.renderAll();
}

function show_spend_category_piechart(ndx) {
    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('debit amount'));

    dc.pieChart('#debit_category_balance')
        .height(200)
        .radius(150)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group);
}

function show_income_category_piechart(ndx) {
    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group().reduceSum(dc.pluck('credit amount'));

    dc.pieChart('#credit_category_balance')
        .height(200)
        .radius(150)
        .transitionDuration(1000)
        .dimension(dim)
        .group(group);
}
