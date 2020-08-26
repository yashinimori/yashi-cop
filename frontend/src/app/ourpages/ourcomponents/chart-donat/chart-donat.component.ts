import {Component, OnInit} from '@angular/core'

@Component({
    selector: 'app-chart-donat',
    templateUrl: './chart-donat.component.html'
})
export class ChartDonatComponent implements OnInit {
    public doughnutChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
    public doughnutChartData = [120, 150, 180, 90];
    public doughnutChartType = 'doughnut';
    constructor() { }
    ngOnInit() {
    }
}