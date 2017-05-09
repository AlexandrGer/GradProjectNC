package com.grad.project.nc.controller.api;


import com.grad.project.nc.service.security.LogoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
public class AuthenticationController {

    @Autowired
    private LogoutService logoutService;

    @RequestMapping("/login/success")
    public Map loginSuccess() {
        return Collections.singletonMap("status", "success");
    }

    @RequestMapping("/login/failed")
    @ResponseBody
    public Map loginFailed() {
        return Collections.singletonMap("status", "failed");
    }

    @RequestMapping("/login/logout")
    @ResponseBody
    public Map logoutSuccess() {
        return Collections.singletonMap("status", "success");
    }

    @RequestMapping(value = "/signout", method = RequestMethod.POST, consumes = "application/json", produces = "application/json" )
    @ResponseBody
    public Map logout(@RequestBody Map<String, String> params) {
        String url = params.get("currentURL");
        return logoutService.getRedirectUrl(url);
    }

}
