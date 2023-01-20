import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, } from '@angular/forms';
import { ApiService } from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Marca nueva", "Segunda mano", "Reconstruido"];
  productForm !: FormGroup;
  actionBtn : string  = "Guardar";
  tituloVentana : string = "Agregar producto";
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private api : ApiService, private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      nombreProducto : ['', Validators.required],
      categoria : ['', Validators.required],
      fecha: ['', Validators.required],
      calidad : ['', Validators.required],
      precio : ['', Validators.required],
      comentario : ['', Validators.required]
    });

    if(this.editData){
      this.actionBtn = "Actualizar";
      this.tituloVentana = "Actualizar producto";
      this.productForm.controls['nombreProducto'].setValue(this.editData.nombreProducto);
      this.productForm.controls['categoria'].setValue(this.editData.categoria);
      this.productForm.controls['fecha'].setValue(this.editData.fecha);
      this.productForm.controls['calidad'].setValue(this.editData.calidad);
      this.productForm.controls['precio'].setValue(this.editData.precio);
      this.productForm.controls['comentario'].setValue(this.editData.comentario);

    }
  }
  agregarProducto(){
   if(!this.editData){
    if(this.productForm.valid){
      this.api.postProduct(this.productForm.value)
      .subscribe({
        next : (res)=>{
          alert("Producto agregado satisfactoriamente!");
          this.productForm.reset();
          this.dialogRef.close('guardado');
        },
        error:()=>{
          alert("Error mientras se agregaba el producto :(");
        }
      })
    }
    }else{
      this.updateProduct();
   }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Producto actualizado exitosamente.");
        this.productForm.reset();
        this.dialogRef.close('actualizar');
      },
      error:()=>{
        alert("Error mientras se actualizaba producto");
       }
    })
  }
}
