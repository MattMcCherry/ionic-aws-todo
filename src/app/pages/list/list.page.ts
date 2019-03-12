import { Component, OnInit } from '@angular/core';
import { ToDoItem, ToDoList } from 'src/app/shared/classes/to-do-list';
import { ModalController, Events } from '@ionic/angular';
import { ListItemModal } from 'src/app/shared/components/list-item-modal/list-item-modal.component';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  amplifyService: AmplifyService;
  modal: any;
  data: any;
  user: any;
  itemList: ToDoList | any;
  signedIn: boolean;

  constructor(
    public modalController: ModalController,
    amplify: AmplifyService,
    events: Events
  ) {

    this.amplifyService = amplify;
    // Listen for changes to the AuthState in order to change item list appropriately
    events.subscribe('data:AuthState', async (data) => {
      console.log(data);
      if (data.loggedIn) {
        this.user = await this.amplifyService.auth().currentUserInfo();
        this.getItems();
      } else {
        this.itemList = [];
        this.user = null;
      }
    })
  }

  async ngOnInit() {
    // Use AWS Amplify to get user data when creating items
    this.user = await this.amplifyService.auth().currentUserInfo();
    this.getItems();
  }

  async modify(item, i) {
    let props = {
      itemList: this.itemList || new ToDoList({ userId: this.user.id }),
      /*
        You pass in an item parameter only when the user clicks on an existing item and therefore populate an editItem value so that your modal knows this is an edit operation.
      */
      editItem: item || undefined
    };

    // Create the modal
    const modal: any = await this.modalController.create({
      component: ListItemModal,
      componentProps: props
    });

    // Listen for the modal to be closed...
    modal.onDidDismiss().then((result) => {
      if (result.data.newItem) {
        // ...and add a new item if modal passes back newItem
        result.data.itemList.items.push(result.data.newItem)
      } else if (result.data.editItem) {
        // ...or splice the items array if the modal passes back editItem
        result.data.itemList.items[i] = result.data.editItem
      }
      this.save(result.data.itemList);
    })

    return modal.present()
  }

  delete(i) {
    this.itemList.items.splice(i, 1);
    this.save(this.itemList);
  }

  complete(i) {
    this.itemList.items[i].status = "complete";
    this.save(this.itemList);
  }

  save(list) {
    // Use AWS Amplify to save the list...
    this.amplifyService.api().post('ToDoItemsCRUD', '/ToDoItems', { body: list }).then((i) => {
      // ... and to get the list after you save it.
      this.getItems()
    })
      .catch((err) => {
        console.log(`Error saving list: ${err}`)
      })
  }

  getItems() {
    if (this.user) {
      // Use AWS Amplify to get the list
      this.amplifyService.api().get('ToDoItemsCRUD', `/ToDoItems/${this.user.id}`, {}).then((res) => {
        console.log(res);
        if (res && res.length > 0) {
          this.itemList = res[0];
        } else {
          this.itemList = new ToDoList({ userId: this.user.id, items: [] });
        }
      })
        .catch((err) => {
          console.log(`Error getting list: ${err}`)
        })
    } else {
      console.log('Cannot get items: no active user')
    }
  }
}
