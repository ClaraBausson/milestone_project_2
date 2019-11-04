queue()
    .defer(d3.csv, "data/budget.csv")
    .await(drawGraphs);
    
