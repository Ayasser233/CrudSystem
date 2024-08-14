import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface crud {
  name: string;
  category: string;
  price: string;
  description: string;
}

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
})
export class CrudComponent {
  data: crud[] = [];
  newData: crud = { name: '', category: '', price: '', description: '' };
  isAval: boolean = false;
  isEditing = false;

  ngOnInit(): void {
    const savedData = localStorage.getItem('data');
    if (savedData) {
      this.data = JSON.parse(savedData);
      this.isAval = this.data.length > 0;
    }
  }

  addData() {
    if (this.newData.name.trim() !== '') {
      this.data.push({ ...this.newData });
      localStorage.setItem('data', JSON.stringify(this.data));
      this.newData = { name: '', category: '', price: '', description: '' };
      this.isAval = true;
    } else {
      alert('Empty data cannot be added.');
    }
  }

  removeData(d: crud) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.data = this.data.filter((i) => i !== d);
        localStorage.setItem('data', JSON.stringify(this.data));
        if (this.data.length === 0) {
          localStorage.clear();
        }
        this.isAval = this.data.length > 0;
        Swal.fire('Deleted!', 'Your data has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your data is safe :)', 'error');
      }
    });
  }

  clearData() {
    this.newData = { name: '', category: '', price: '', description: '' };
  }

  updateData(data: crud , newName: string, newCategory:string, newPrice:string, newDescription: string):
  { name: string;
    category: string;
    price: string;
    description: string; } | void  {
    const index = this.data.findIndex(d => d === data);
    const editedName = newName.trim();
    const editedCate = newCategory.trim();
    const editedPrice = newPrice.trim();
    const editedDesc = newDescription.trim();


    if(index !== -1){
      if(editedName !== ""){
        this.data[index] = {
          ...data,
          name: editedName,
          description: editedDesc || '',
          price: editedPrice || '',
          category: editedCate || ''
        };
      }
      else{
        this.isEditing = true;

        newName = this.data[this.data.indexOf(data)].name;
        newDescription = this.data[index].description || '';
        newPrice = this.data[index].price || '';
        newCategory = this.data[index].category || '';
        console.log(newName);

        return this.newData = { name: newName, category:newCategory, price:newPrice, description: newDescription}

      }
    }
    this.newData = {name: '', category: '', price: '', description: ''};
    this.isEditing = false;
    Swal.fire(
      'Updated!',
      'Your data has been updated.',
      'success'
  );

  }

  buttonText() {
    return this.isEditing ? 'Update Product' : 'EDIT';
}
}
