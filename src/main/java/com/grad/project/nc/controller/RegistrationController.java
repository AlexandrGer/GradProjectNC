package com.grad.project.nc.controller;

import com.grad.project.nc.model.Product;
import com.grad.project.nc.model.RoleOld;
import com.grad.project.nc.model.UserOLD;
import com.grad.project.nc.persistence.ProductDao;
import com.grad.project.nc.service.notifications.EmailService;
import com.grad.project.nc.service.security.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.ArrayList;

@Controller
public class RegistrationController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ProductDao productDao;


    @RequestMapping(value = "/registration", method = RequestMethod.GET)
    public String registration(Model model) {
        model.addAttribute("user", new UserOLD());

        return "registration";
    }

    @RequestMapping(value = "/registration", method = RequestMethod.POST)
    public String registration(@ModelAttribute("user") UserOLD userOLD) {

        ArrayList<RoleOld> roleOlds = new ArrayList<>();
        roleOlds.add(RoleOld.USER);
        userOLD.setAuthorities(roleOlds);
        emailService.sendRegistrationEmail(userOLD);
        userService.createUser(userOLD);

        Product p = new Product();
        p.setProductId((long) 3);
        p.setProductTypeId((long) 12);
        p.setDescription("new Descr");
        p.setName("NoARR");

        productDao.update(p);


        return "redirect:/index";
    }
}
