const express=require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
 const path=require('path')
const multer  = require('multer')
const app = express()

const image=require('./models/gallery-schema');
const gallery=require('./routes/gallery')

const db=require('./config/mongoose');

app.use(cors())


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/uploads",express.static(path.join("./uploads")))



app.use("/uploads",express.static(path.join("gallery/server/uploads")))
//app.use(auth, express.static(__dirname + '/uploads'));
app.use('/gallery',gallery)

app.listen(3000,()=>{
    console.log("The server sarted")
});

const MIME_TYPE_MAP={
   'image/png':'png',
   'image/jpeg':'jpg',
   'image/jpg':'jpg'
};
// var auth = function(req, res, next) {
//    function unauthorized(res) {
//      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
//      return res.send(401);
//    };
// }



const storage = multer.diskStorage({
    destination:(req, file, cb)=> {
      const isvalid=MIME_TYPE_MAP[file.mimetype];
      let error=new Error('INvalid')
      if(isvalid){
         error=null;
      }
       cb(error,"./uploads"); 
    },
    filename: (req, file, cb) =>{
      const name=file.originalname.toLowerCase().split(' ').join('-');
      const ext =MIME_TYPE_MAP[file.mimetype];
      cb(null,name+'-'+Date.now()+'.'+ext)
    }
  });
 //const upload = multer({ storage: storage })
 app.post('/file',multer({storage:storage}).single('file'), (req,res,next)=>{
      const url=req.protocol+'://'+req.get("host")
      imagepath=url+"/uploads/"+req.file.filename
        // console.log(imagepath);
        // console.log(req.body.id)
        image.updateOne({_id:req.body.id},{$push:{photopath:imagepath}},(err,result)=>{
            if(err){ return res.send(err)}
            else{
                console.log(result)
            return res.send({imagepath:imagepath})
            }
        })
      //upload(req,res,function(err){
      // if(!req.file){
      //   console.log("error in uploading",err);
      //   const error=new Error("No file found")
      //   error.httpStatusCode=400
      //   // return res.redirect('back');
      // }


    //    image.create({
    //        avatar:imagepath
    //    })
       
    //    return res.send({status:'ok'})
     
    })
    app.get('/getfiles',(req,res,nest)=>{
       var a=[]
       image.find().then(documents=>{
         console.log(documents[0].avatar)
         for (let i of documents){
            a.push([i.avatar])
         }
         console.log(a)
          res.send({value:a})
       })
    })


    