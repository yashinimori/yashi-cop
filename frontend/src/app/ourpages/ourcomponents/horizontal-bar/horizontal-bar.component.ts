import {Component, OnInit} from '@angular/core'
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
    selector: 'app-horizontal-bar',
    templateUrl: './horizontal-bar.component.html',
})

export class HorizontalBarComponent {

    barChartOptions: ChartOptions = {
        responsive: true,
      };
      barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
      barChartType: ChartType = 'bar';
      barChartLegend = true;
      barChartPlugins = [];
    
      barChartData: ChartDataSets[] = [
        { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
      ];
    
  
  }