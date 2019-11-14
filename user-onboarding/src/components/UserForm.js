import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

const UserForm = ({ errors, touched, status }) => {

    const [users, setUsers] = useState([])

    useEffect(() => {
        status && setUsers((users) => [...users, status])
    }, [status])

    return (
        <div className="user-form">
            <Form>
                <label>* Name: </label>
                <Field type="text" name="name" placeholder="Your Name" />
                {touched.name && errors.name && (
                    <p className="errors">{errors.name}</p>
                )}
                <label>* E-Mail Address:</label>
                <Field type="text" name="email" placeholder="handle@domain.com" />
                {touched.email && errors.email && (
                    <p className="errors">{errors.email}</p>
                )}
                <label>* Password: </label>
                <Field type="password" name="password" placeholder="Set Password"></Field>
                {touched.password && errors.password && (
                    <p className="errors">{errors.password}</p>
                )}
                <label>
                    *
                    <Field type="checkbox" name="termsAgreed" />
                    By checking this box, I consent that I have read and agree to the <a href="#">Terms and Conditions</a>.
                </label>
                {errors.termsAgreed && (
                    <p className="errors">{errors.termsAgreed}</p>
                )}
                <button type="submit">Submit</button>
            </Form>
            {users.map((user) => {
                return (
                    <div key={user.id} className="user-container">
                        <ul>
                            <li>Name: {user.name}</li>
                            <li>Email: {user.email}</li>
                            <li>Password: {user.password} (Big security risk, but it's here for the sake of this project.) </li>
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

const FormikUserForm = withFormik({
    mapPropsToValues({ name, email, password, termsAgreed }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            termsAgreed: termsAgreed || false
        };
    },
    validationSchema: Yup.object().shape({
        name: Yup.string().required("This field is required."),
        email: Yup.string().required("This field is required.").email("E-Mail Address is not valid."),
        password: Yup.string().required("This field is required."),
        termsAgreed: Yup.boolean().oneOf([true], "You must read and agree to our Terms and Conditions.")

    }),
    handleSubmit(values, { setStatus }) {
        //Values is our object with -ALL- our data on it.
        axios
            .post("https://reqres.in/api/users/", values)
            .then(response => {
                setStatus(response.data);
                console.log(response);
            })
            .catch(error => {
                console.log(`Server responded with ${error}.`);
            });
    }
})(UserForm);

export default FormikUserForm;