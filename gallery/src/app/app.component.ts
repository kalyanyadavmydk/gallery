import { Component ,OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  images;
  dataval;

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/getfiles').subscribe((data)=>{
     this.dataval=data.value
      console.log(this.dataval)
      
    })
  }
  
  constructor(private http:HttpClient , private form : FormBuilder){}
  
  onfileselect(event){
    if(event.target.files.length>0){
      
      const file=event.target.files;
      for(let img of file)
      {
      this.images=img;
      
      const formdata=new FormData();
      formdata.append('file',this.images);

      this.http.post<any>('http://localhost:3000/file',formdata).subscribe((data)=>{
      console.log(data)
    });
    }
    }
    
  }
  onsubmit(){
    
    
    
    //console.log(this.images)
    // for( let d of formdata){

    // }

    this.http.get<any>('http://localhost:3000/getfiles').subscribe((data)=>{
     this.dataval=data.value
      console.log(this.dataval)
      
    })
    // setTimeout(()=>{
    //   for(let i=0;i<this.dataval.length ;i++){
    //     this.dataval[i].avatar="../../server/"+this.dataval[i].avatar
    //     console.log(this.dataval[i].avatar)
    //   }
    // },1000)
    
  }

}
