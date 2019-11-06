queue()
    .defer(d3.csv, "data/budget.csv")
    .await(drawGraphs);

function drawGraphs(error, budgetData) {
    var ndx = crossfilter(budgetData);
    
    show_type_balance(ndx);
    
    dc.renderAll();
}

function show_type_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('category'));
    var group = dim.group();
    
    dc.barChart("#debit_credit_balance")
        .width(800)
        .height(300)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(dim)
        .group(group)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .xAxisLabel("Type");
}