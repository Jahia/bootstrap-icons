package org.jahiacommunity.modules.bootstrap.icons.initializers;

import org.jahia.services.content.JCRPropertyWrapper;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.ValueImpl;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.content.nodetypes.initializers.ModuleChoiceListInitializer;
import org.jahia.services.content.nodetypes.renderer.AbstractChoiceListRenderer;
import org.jahia.services.content.nodetypes.renderer.ModuleChoiceListRenderer;
import org.jahia.services.render.RenderContext;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.*;


@Component(name = "usageInitializer", service = ModuleChoiceListInitializer.class, immediate = true)
public class UsageInitializer extends AbstractChoiceListRenderer implements ModuleChoiceListInitializer, ModuleChoiceListRenderer {

    private static final Logger logger = LoggerFactory.getLogger(UsageInitializer.class);

    private String key = "usageInitializer";

    /**
     * {@inheritDoc}
     */
    public List<ChoiceListValue> getChoiceListValues(ExtendedPropertyDefinition epd, String param, List<ChoiceListValue> values,
                                                     Locale locale, Map<String, Object> context) {

        //Create the list of ChoiceListValue to return
        List<ChoiceListValue> myChoiceList = new ArrayList<ChoiceListValue>();

        if (context == null) {
            return myChoiceList;
        }

        HashMap<String, Object> myPropertiesMap = null;

        // embedded
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","bootstrapiconsmix:iconWidth");
        myChoiceList.add(new ChoiceListValue("embedded",myPropertiesMap,new ValueImpl("embedded", PropertyType.STRING, false)));

        // sprite
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","bootstrapiconsmix:iconWidth");
        myChoiceList.add(new ChoiceListValue("sprite",myPropertiesMap,new ValueImpl("sprite", PropertyType.STRING, false)));

        // external-image
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","bootstrapiconsmix:iconWidth");
        myChoiceList.add(new ChoiceListValue("external-image",myPropertiesMap,new ValueImpl("external-image", PropertyType.STRING, false)));

        // icon-font
        myPropertiesMap = new HashMap<String, Object>();
        myPropertiesMap.put("addMixin","bootstrapiconsmix:fontSize");
        myChoiceList.add(new ChoiceListValue("icon-font",myPropertiesMap,new ValueImpl("icon-font", PropertyType.STRING, false)));

        //Return the list
        return myChoiceList;
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
