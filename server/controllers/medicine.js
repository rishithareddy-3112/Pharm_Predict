const Medicine = require('../models/medicine')
const { spawn } = require('child_process');
exports.addMedicine = (req, res) => {
    console.log(req.body)
    const { name, substitute0, substitute1, substitute2, substitute3, substitute4, sideEffect0, sideEffect1, sideEffect2, sideEffect3, sideEffect4, use0, use1, use2, use3, use4, ChemicalClass, ActionClass } = req.body;
    const newMedicine = new Medicine({ name, substitute0, substitute1, substitute2, substitute3, substitute4, sideEffect0, sideEffect1, sideEffect2, sideEffect3, sideEffect4, use0, use1, use2, use3, use4, ChemicalClass, ActionClass })
    if (!name) {
        return res.status(400).json({
            error: 'Drug name is required!'
        })
    }
    newMedicine.save()
        .then(() => {
            return res.json({
                message: 'Medicine added successfully'
            })
        })
        .catch((err) => {
            console.log(err)
            return res.status(400).json({
                error: 'Error saving medicine in database, Try again'
            })
        })
}

exports.displayMedicine = (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    Medicine.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .then((drugs) => {
            res.json(drugs);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
};


exports.searchMedicine = async (req, res) => {
    const searchTerm = req.query.searchTerm || '';
    try {
        const filteredMedicines = await Medicine.find({ name: { $regex: new RegExp(searchTerm, 'i') } });
        res.json(filteredMedicines);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error searching medicine data' });
    }
}

exports.predictClass = (req, res) => {
    const { input_data } = req.body
    const input_data_json = JSON.stringify(input_data);
    const pythonProcess = spawn('py', ['C:/Users/bhava/predict.py', input_data_json]);
    pythonProcess.stdout.on('data', (data) => {
        const result = JSON.parse(data.toString());
        // console.log(result.result)
        return res.json({
            message: `Therapeutic class is "${result.result}"`
        })
    });
}

exports.viewAnalytics = (req, res) => {

}
exports.viewOrders = (req, res) =>{
    
}

