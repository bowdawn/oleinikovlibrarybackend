import { Router } from "express";
const router = Router();


router.get("" , async (req, res ) =>  {
    try {
     res.status(200).json(
       "Oleinikov Library"
     );
   } catch (error) {
     console.error(error);
     return res.status(500).send("Server error");
   }
}
)

export default router;