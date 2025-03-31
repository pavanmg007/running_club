const express = require('express');
const router = express.Router();
const marathonController = require('../controllers/marathonController');
const participationController = require('../controllers/participationController');
const auth = require('../middleware/auth');

router.get('/', marathonController.getAllMarathons);
router.get('/:id', auth, marathonController.getMarathonById);
router.get('/:id/participants', auth, marathonController.getMarathonParticipants);

router.post('/:id/participate', auth, participationController.participate);
router.delete('/:id/participate', auth, participationController.unparticipate);

module.exports = router;