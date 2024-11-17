const express = require('express')
const bodyParser = require('body-parser')

const mongoose = require('mongoose')


const PORT = 4000

const app = express()

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/SimpleExpressApi')
    .then(() => console.log('mongodb connected'))
    .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique : true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);


app.get('/api/allUsers', async (req, res) => {
    const users = await User.find();
    res.json(users);

})

app.post('/api/addUser', async (req, res) => {
    const { username, password } = req.body;
    

    await User.create({ username, password });
    res.send('user added');
})

app.put('/api/updateUser/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    const oldUser = await User.findOne({ _id: id });
    oldUser.username = username;
    oldUser.password = password;
    await oldUser.save();

    res.send('user updated');

})

app.delete('/api/deleteUser/:id', async (req, res) => {
    const { id } = req.params;

    await User.deleteOne({ _id: id });
    res.send('user deleted');

})


app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
})