package org.jahiacommunity.modules.bootstrap.icons.initializers;

import org.apache.commons.lang.WordUtils;
import org.jahia.data.templates.JahiaTemplatesPackage;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.JCRPropertyWrapper;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.content.nodetypes.initializers.ModuleChoiceListInitializer;
import org.jahia.services.content.nodetypes.renderer.AbstractChoiceListRenderer;
import org.jahia.services.content.nodetypes.renderer.ModuleChoiceListRenderer;
import org.jahia.services.render.RenderContext;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.io.File;
import java.io.IOException;
import java.util.*;

@Component(name = "bootstrapIconInitializer", service = ModuleChoiceListInitializer.class, immediate = true)
public class BootstrapIconInitializer  extends AbstractChoiceListRenderer implements ModuleChoiceListInitializer, ModuleChoiceListRenderer {

    private static final Logger logger = LoggerFactory.getLogger(BootstrapIconInitializer.class);

    private String key = "bootstrapIconInitializer";

    public List<ChoiceListValue> getChoiceListValues(ExtendedPropertyDefinition epd, String param, List<ChoiceListValue> values, Locale locale, Map<String, Object> context) {
        ArrayList<ChoiceListValue> results = new ArrayList<>(1300);
        final JahiaTemplatesPackage templatesPackage = ServicesRegistry.getInstance().getJahiaTemplateManagerService().getTemplatePackageById(
                epd.getDeclaringNodeType().getSystemId());

        try {
            File img = templatesPackage.getResource("img").getFile();
            for (File f : img.listFiles()) {
                String fileName = f.getName();
                if (fileName.endsWith(".svg")) {
                    String icon = fileName.substring(0, fileName.length() - 4);
                    results.add(new ChoiceListValue(WordUtils.capitalize(icon.replaceAll("-"," ")), icon));
                }
            }
        } catch (IOException e) {
            logger.error("Could not get img dir " + e.getMessage());
        }
        Collections.sort(results);

        return results;
    }

    /**
     * {@inheritDoc}
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     * {@inheritDoc}
     */
    public String getKey() {
        return key;
    }

    /**
     * {@inheritDoc}
     */
    public String getStringRendering(RenderContext context, JCRPropertyWrapper propertyWrapper) throws RepositoryException {
        final StringBuilder sb = new StringBuilder();

        if (propertyWrapper.isMultiple()) {
            sb.append('{');
            final Value[] values = propertyWrapper.getValues();
            for (Value value : values) {
                sb.append('[').append(value.getString()).append(']');
            }
            sb.append('}');
        } else {
            sb.append('[').append(propertyWrapper.getValue().getString()).append(']');
        }

        return sb.toString();
    }

    /**
     * {@inheritDoc}
     */
    public String getStringRendering(Locale locale, ExtendedPropertyDefinition propDef, Object propertyValue) throws RepositoryException {
        return "[" + propertyValue.toString() + "]";
    }
}
