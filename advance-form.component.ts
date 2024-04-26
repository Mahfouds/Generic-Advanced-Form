import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DialogService, EditableTip, TableWidthConfig } from 'ng-devui';
import { Subscription } from 'rxjs';
import { ListDataService, ListPager } from './list-data.service';
import { FormLayout } from 'ng-devui';
import { FormConfig } from 'src/app/@shared/components/admin-form/admin-form.type';
import { Config } from 'src/app/@shared/models/config';
import { ModalData } from 'src/app/@shared/models/modalData';

@Component({
  selector: 'da-advance-form-advanced',
  templateUrl: './advance-form.component.html',
  styleUrls: ['./advance-form.component.scss'],
})
export class AdvanceFormComponent implements OnInit {
  @Input() cols: Config[];
  @Input() listData = [];
  @Output() dataEvent= new EventEmitter<any>();
  editableTip = EditableTip.btn;
  nameEditing: boolean;
  busy: Subscription;
  defaultRowData:any;
  tableWidthConfig: TableWidthConfig[];
  @Input() modalData?:ModalData;
  listData2:any=[];
  showLoading = false;
  pager = {
    total: 0,
    pageIndex: 1,
    pageSize: 10,
  };
  searchForm = {
    keyword: '',
    gender: 'All',
  };
  changesMade = false;



  reset() {
    this.searchForm = {
      keyword: '',
      gender: 'all',
    };
    this.getList();
  }


  toggleLoading() {
    this.showLoading = true;
    setTimeout(() => {
      this.showLoading = false;
    }, 1000);
    if(this.listData){
    this.addPermanllyRow(this.cols[0].messageOfSaveChanges,this.cols[0].titleOfSaveChanges);
    }
  }

  addPermanllyRow(message?:string,title?:string) {
    const defaultMessage = 'Are you sure you want to import it?';
    const defaultTitle = 'This is a title';
  const dialogTitle = title || defaultTitle;
  const dialogMessage = message || defaultMessage;
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: dialogTitle,
      showAnimate: false,
      content: dialogMessage,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: () => {
            results.modalInstance.hide();
            this.changesMade=false
            this.ngOnInit()
            // this.listDataService.clearDevices()
            // this.isDevicesForImportPageVar=false;
            // this.listDataService.addDevicesToExistDevices(this.listData)
            // this.listDataserviceBags.clearImportedBags();
            // this.listDataService.clearDevices();
            // this.router.navigateByUrl("devices")
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }

  headerNewForm = false;

  formConfig: FormConfig;

 extractDefaultValues() {
    const defaultValues = {};
    this.cols.forEach(col => {
      defaultValues[col.prop] = col.defaultVal;
    });
    return defaultValues;
  }
  



  constructor(private dialogService: DialogService,private scrollToElement: ElementRef) {
   }
  ngOnInit() {
  
    // this.listData2=this.listData;
    this.listData2=this.getList().pageList;
    this.pager.total=this.getList().total
    this.defaultRowData = this.extractDefaultValues();
    this.tableWidthConfig = this.extractTableWidthConfig();
    this.formConfig = {
      layout: FormLayout.Horizontal,
      labelSize: 'sm',
      items: this.cols.filter(col=> !col.hide)
    };
    console.log(this.cols);
  
  }

  onEditEnd(rowItem, field) {
    rowItem[field] = false;
  }

  getList() {
    if (this.searchForm.keyword !== '') {
      const keyword = this.searchForm.keyword.toUpperCase();
      const searchableItems = this.cols.filter(col => col.searchable);
      console.log("The searchable items are: " + JSON.stringify(searchableItems, null, 2));
  
      const { pageList, total } = this.getListData(this.pager);
  
      this.listData2 = pageList.filter(item => {
        for (const col of searchableItems) {
          const columnName = col.prop;
          const itemData = item[columnName];
          console.log("The item data is: " + JSON.stringify(itemData, null, 2));
  
          if (itemData && itemData.toUpperCase().includes(keyword.toUpperCase())) {
            return true; // Return true if keyword found in any searchable column
          }
        }
        return false;
      });
  
      return { pageList: this.listData2, total };
    } else {
      const { pageList, total } = this.getListData(this.pager);
      this.listData2 = pageList;
      console.log("Affectation made: " + JSON.stringify(this.listData, null, 2));
  
      return { pageList: this.listData2, total };
    }
  }
  
  onSearchInputChange(value: string) {
    console.log("search event ")

    // If the input value becomes empty, trigger getList() method
    if (!value.trim()) {
      this.getList();
    }
  }
  
  private pagerList(data, pager) {
    return data.slice(
      pager.pageSize * (pager.pageIndex - 1),
      pager.pageSize * pager.pageIndex
    );
  }

  getListData(pager: ListPager): any {
    console.log("the device in service getListData is  ")
    return {
      pageList: this.pagerList(this.listData, pager),
      total: this.listData.length,
    }
  }


  beforeEditStart = (rowItem, field) => {
    return true;
  };
  onCellEdit() {
    this.changesMade = true;
  }
  
  beforeEditEnd = (rowItem, field) => {
    console.log('beforeEditEnd');
    if (rowItem && rowItem[field].length < 3) {
      
      return false;
    } else {
      return true;
    }
  };

  newRow() {
    this.headerNewForm = true;
    this.changesMade=true;

  }

  getuuid() {
    return new Date().getTime() + 'CNWO';
  }

  quickRowAdded(e) {
    const newData = { ...e };
    this.listData2.unshift(newData);
    this.headerNewForm = false;
  }

  quickRowCancel() {
    this.headerNewForm = false;
  }

  subRowAdded(index, item) {
    this.listData[index].$expandConfig.expand = false;
    const newData = { ...this.defaultRowData };
    this.listData.splice(index + 1, 0, newData);
  }

  subRowCancel(index) {
    this.listData[index].$expandConfig.expand = false;
  }

  toggleExpand(rowItem) {
    if (rowItem.$expandConfig) {
      rowItem.$expandConfig.expand = !rowItem.$expandConfig.expand;
    }
  }

  onPageChange(e) {
    this.pager.pageIndex = e;
    this.getList();
  }

  onSizeChange(e) {
    this.pager.pageSize = e;
    this.getList();
  }

   extractTableWidthConfig() {
    const tableWidthConfig = [];
    console.log("----------------------------");
    console.log(this.cols);
    this.cols.forEach(col => {
      tableWidthConfig.push({
        field: col.prop,
        width: col.width || '150px',
      });
    });
    return tableWidthConfig;
  }

  showRowPreviw(id)
  {
    this.dataEvent.emit(id);
    const results = this.dialogService.open({
      id: 'show-branches',
      width: '1200px',
      maxHeight: '800px',
      title: this.modalData.title,
      showAnimate: false,
      content: this.modalData.contentData,
      backdropCloseable: true,
      onClose: () => {},
      buttons: [],
    });
  }

  deleteRow(index) {
    const results = this.dialogService.open({
      id: 'delete-dialog',
      width: '346px',
      maxHeight: '600px',
      title: 'Delete',
      showAnimate: false,
      content: 'Are you sure you want to delete it?',
      backdropCloseable: true,
      onClose: () => { },
      buttons: [
        {
          cssClass: 'primary',
          text: 'Ok',
          disabled: false,
          handler: () => {
            this.listData2.splice(index, 1);
            results.modalInstance.hide();
            this.changesMade=true;
          },
        },
        {
          id: 'btn-cancel',
          cssClass: 'common',
          text: 'Cancel',
          handler: () => {
            results.modalInstance.hide();
          },
        },
      ],
    });
  }
}
