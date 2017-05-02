package com.grad.project.nc.controller.api;

import com.grad.project.nc.model.Region;
import com.grad.project.nc.persistence.CrudDao;
import com.grad.project.nc.persistence.RegionDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user/regions/")
public class RegionsController {
    private CrudDao<Region> regionsDao;

    @Autowired
    public RegionsController( RegionDao regionsDao) {
        this.regionsDao = regionsDao;
    }

    @RequestMapping("/all")
    public List<String> test() {
        return regionsDao.findAll().stream().map(Region::getRegionName).collect(Collectors.toList());
    }
}