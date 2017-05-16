package com.grad.project.nc.service.instances;

import com.grad.project.nc.model.ProductInstance;

import java.util.Collection;

public interface InstanceService {
    ProductInstance getById(Long id);
    boolean isInstanceOwnedBy(long instanceId, long userId);
    Collection<ProductInstance> getByDomainId(Long domainId);

}
