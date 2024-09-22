import express from 'express';
const router = express.Router();
import { registrar, confirmar, perfil, autenticar } from '../controllers/veterinarioController.js';
import check_auth from '../middleware/authMiddleware.js';


router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login/', autenticar);
router.get('/perfil', check_auth, perfil);







export default router;
//Nota
// cuando lees datos de la URL usamos request params,
// y cuando lees datos de un formulario usamos request body 
