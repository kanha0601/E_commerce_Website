const Contact= require("../model/Contact")

const AddContact = async (req, res) => {
  try {
const contact = await Contact.create(req.body);

    return res.json({
      message: "contact created successfully",
      contact:contact,
      status:true,
    });
  } catch (err) {
    return res.json({
      message: "Error while create contact",
      status: false,
    });
  }
};

const GetContact=async(req,res)=>{
    try {

     const dfghj=await Contact.find()
        
        return res.json({
            message:"lets get contacts",
            contact:dfghj,
            status:true
        });
    } catch (err) {
     console.log(err);

        return res.json({

            message:"error while fetch",
            status :false
        });
    }
};

const updateContact=async(req,res)=>{
    try {
         const updatedContact =await Contact.findByIdAndUpdate(req.params.id,req.body)

        
        return res.json({
            message:"lets update",
            // id:req.params.id
            status:true,
            updatedContact
        });
    } catch (err) {
    console.log(err);
    

        return res.json({

            message:"error while update",
            status :false
        });
    }
};

const DeleteContact=async(req,res)=>{
    try {
         const DeleteContact =await Contact.findByIdAndDelete(req.params.id)

        
        return res.json({
            message:"delte successfully",
            // id:req.params.id
            status:true,
            DeleteContact
        });
    } catch (err) {
    console.log(err);
    

        return res.json({

            message:"error while update",
            status :false
        });
    }
};
module.exports = {
  AddContact,
  GetContact,
  updateContact,
  DeleteContact
};