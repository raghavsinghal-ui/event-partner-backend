const eventModel=require("../models/event.models");


exports.listEvent = async (req, res) => {
  try {
    const {  type, cursor } = req.query;

    let query = {};

    
    if (type) {
      query.type = type;
    }



    if (cursor) {
      const parsed = JSON.parse(cursor);

      query.$or = [
        { createdAt: { $lt: new Date(parsed.createdAt) } },
        {
          createdAt: new Date(parsed.createdAt),
          _id: { $lt: parsed._id }
        }
      ];
    }

    let dbQuery = eventModel.find(query);


 
      dbQuery = dbQuery.sort({ createdAt: -1, _id: -1 });
   
    
    const events = await dbQuery.limit(10);

    let nextCursor = null;

    if (events.length > 0) {
      const last = events[events.length - 1];

      nextCursor = JSON.stringify({
        createdAt: last.createdAt,
        _id: last._id
      });
    }

    res.json({
      data: events,
      nextCursor
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.searchEvents=async(req,res)=>{
    try{
 const { search} = req.query;
if(!search){
    return res.status(400).json({message:"Search parameter is required"});
}
const events=await eventModel.find(

  { $text: { $search: search } },
  { score: { $meta: "textScore" } }


    )
    .sort({ score: { $meta: "textScore" } })
.limit(10);
res.status(200).json({data:events});

}

    catch(error){
        res.status(500).json({message:error.message});
    }
}