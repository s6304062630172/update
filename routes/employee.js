let express = require('express');
let router = express.Router();
let dbCon = require('../lib/db');

// display book page
router.get('/', (req, res, next) => {
    dbCon.query('SELECT * FROM employee ORDER BY id asc', (err, rows) => {
        if (err) {
            req.flash('error', err);
            res.render('employee', { data: '' });
        } else {
            res.render('employee', { data: rows });
        }
    })
})

// display add book page
router.get('/add', (req, res, next) => {
    res.render('employee/add', {
        employee_name: '',
        employee_surname: '',
        employee_phone: '',
        employee_position: ''
    })
})

// add a new book
router.post('/add', (req, res, next) => {
    let employee_name = req.body.employee_name;
    let employee_surname = req.body.employee_surname;
    let employee_phone = req.body.employee_phone;
    let employee_position = req.body.employee_position;
    let errors = false;
    

    if (employee_name.length === 0 || employee_surname.length === 0 || employee_phone.length === 0 || employee_position.length === 0   )  {
        errors = true;
        // set flash message
        req.flash('error', 'Please Info');
        // render to add.ejs with flash message
        res.render('employee/add', {
            employee_name: employee_name,
            employee_surname: employee_surname,
          employee_phone: employee_phone,
            employee_position: employee_position
        })
    }
        // if no error
        if (!errors) {
            let form_data = {
                employee_name: employee_name,
                employee_surname: employee_surname,
                employee_phone: employee_phone,
                employee_position: employee_position
            }
    
            // insert query
            dbCon.query('INSERT INTO employee SET ?', form_data, (err, result) => {
                if (err) {
                    req.flash('error', err)
    
                    res.render('employee/add', {
                        employee_name: form_data.employee_name,
                        employee_surname: form_data.employee_name,
                      employee_phone: form_data.employee_phone,
                        employee_position: form_data.employee_position
                    })
                } else {
                    req.flash('success', 'employee successfully added');
                    res.redirect('/employee');
                }
            })
        }
    })

    // display edit book page
router.get('/edit/(:id)', (req, res, next) => {
    let id = req.params.id;

    dbCon.query('SELECT * FROM employee WHERE id = ' + id, (err, rows, fields) => {
        if (rows.length <= 0) {
            req.flash('error', 'employee not found with id = ' + id)
            res.redirect('/employee');
        } else {
            res.render('employee/edit', {
                title: 'Edit Employee',
                id: rows[0].id,
                employee_name: rows[0].employee_name,
                employee_surname: rows[0].employee_surname,
                employee_phone: rows[0].employee_phone,
                employee_position: rows[0].employee_position

            })
        }
    });
})

// update book page
router.post('/update/:id', (req, res, next) => {
    let id = req.params.id;
    let employee_name = req.body.employee_name;
    let employee_surname = req.body.employee_surname;
    let employee_phone = req.body.employee_phone;
    let employee_position = req.body.employee_position;

    let errors = false;

    if (employee_name.length === 0 || employee_surname.length === 0 || employee_phone.length === 0 || employee_position.length === 0 ) {
        errors = true;
        req.flash('error', 'Please enter info');
        res.render('employee/edit', {
            id: req.params.id,
            employee_name: employee_name,
            employee_surname: employee_surname,
            employee_phone: employee_phone,
            employee_position: employee_position

        })
    }
    // if no error
    if (!errors) {
        let form_data = {
            employee_name: employee_name,
            employee_surname: employee_surname,
            employee_phone: employee_phone,
            employee_position: employee_position
        }
        // update query
        dbCon.query("UPDATE employee SET ? WHERE id = " + id, form_data, (err, result) => {
            if (err) {
                req.flash('error', err);
                res.render('employee/edit', {
                    id: req.params.id,
                    employee_name: form_data.employee_name,
                    employee_surnamer: form_data.employee_surname,
                    employee_phone: form_data.employee_phone,
                    employee_position: form_data.employee_position
                })
            } else {
                req.flash('success', 'Emplyoee successfully updated');
                res.redirect('/employee')
            }
        })
    }
})

// delete book
router.get('/delete/(:id)', (req, res, next) => {
    let id = req.params.id;

    dbCon.query('DELETE FROM employee WHERE id = ' + id, (err, result) => {
        if (err) {
            req.flash('error', err),
            res.redirect('/employee');
        } else {
            req.flash('success', 'Employee successfully deleted! ID = ' + id);
            res.redirect('/employee');
        }
    })
})


module.exports = router;