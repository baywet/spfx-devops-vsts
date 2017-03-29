import * as ko from 'knockout';
import styles from './DevOpsWebPart.module.scss';
import { IDevOpsWebPartWebPartProps } from './IDevOpsWebPartWebPartProps';
import { DevOpsWebPartService } from './DevOpsWebPart.service';

export interface IDevOpsWebPartBindingContext extends IDevOpsWebPartWebPartProps {
  shouter: KnockoutSubscribable<{}>;
}

export default class DevOpsWebPartViewModel {
  public description: KnockoutObservable<string> = ko.observable('');
  public opA = ko.observable<string>("0");
  public opB = ko.observable<string>("0");
  public opResult = ko.observable<number>(0);

  public labelClass: string = styles.label;
  public helloWorldClass: string = styles.helloWorld;
  public containerClass: string = styles.container;
  public rowClass: string = `ms-Grid-row ms-bgColor-themeDark ms-fontColor-white ${styles.row}`;
  public buttonClass: string = `ms-Button ${styles.button}`;
  private service: DevOpsWebPartService = new DevOpsWebPartService();
  public doCalculation = () => {
    let result = this.service.add(parseInt(this.opA()), parseInt(this.opB()));
    this.opResult(result);
  }
  
  constructor(bindings: IDevOpsWebPartBindingContext) {
    this.description(bindings.description);

    // When web part description is updated, change this view model's description.
    bindings.shouter.subscribe((value: string) => {
      this.description(value);
    }, this, 'description');
  }
  
}
