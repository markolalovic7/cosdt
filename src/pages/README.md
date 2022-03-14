## Generate list entity view / single entity form

This project uses antd table as a base for list view Datagrid. There are some improvements on it which should help faster development.
All props from antd Table component apply to custom DataGrid component too. Typescript is mandatory.

### Create model

First step in creating entity list/single view is to clone domain model for that entity. All classes can be found under
src/model. Domain folder is reserved for backend classes while any other UI related classes are kept under /ui folder. Class descriptions
can be found in backend source code or they can be found on swagger, but class inheritance is preffered so it is better to clone classes from Java source. There is SampleClass.ts that describes simple entity, you can use that as a reference.

### Create APIs

APIs are kept under src/core/api folder. All APIs are exported from index.ts as const named 'api'. You need to add your API class instance here, and create new file named [EntityName]API.ts. You can use SampleAPI.ts as reference - all methods should return Axios promise with appropriate ts class and api url. When APIs are used in project, you need to use async/await pattern wrapped with mandatory try/catch.

### Create list view

You need to create at least three files - one for list view, one for detailed view and one as css module with styles. You can use sample page as reference. Be aware of naming convention - pages should have 'Page' suffix in component/file name while components should have 'Component' suffix in component name only.

SamplePage.tsx contains list view for sample entity, while SamplePageDetails contains single view/form for selected entity id. You can copy both, rename as needed (names, apis, column definitions, single view form inputs etc). This will be sufficient for most entities. Single entity form uses antd form, so follow all guidelines from antd docs regarding control, default values, events, validation rules etc.

When working with column definitions, have in mind that they are extended default antd column definitions. You can see extended props with descriptions in DataGridColumnType. For other props check antd official documentation.


### Remote or UI pagination

Samples for both remote pagination and UI pagination are kept in src/sample folder. For APIs that support remote paging, it is prefered 
to use it.

### Custom toolbar actions/row actions

For most entities basic configuration is sufficient. However, there are some situations when this might not be enough. For example - you have some custom row action. Row actions are defined in DataGridRowActions component whil toolbar actions (create new entity, delete selected, search) are in DataGridActions component. There are three ways to resolve this situation

 - Create new component that wraps existing action component and add necessary actions (preffered, but unusable if you have to remove some of default actions). In list view, put this component to RowActions/Actions prop instead of default one
 - Copy code from row actions/actions component to new file and modify it. In list view make sure that RowActions/Actions prop is your custom component instead of default one. Pass necessary props to it.
 - Modify DataGrid component. This is your last resort that should be avoided since it will affect all existing pages that use DataGrid. Consult with colleagues before doing this

DataGridRowActions and DataGridActions both use React context - you can view which props are passed in DataGridRowContextType/ DataGridContextType component. You can use them in your custom action components.

### Add Routes

Routes are containted in multiple files. Find appropriate level to add necessary routes for component. You can see this in App.tsx or in AdminPage.tsx for nested routes. All routes must be defined via enums that are under src/model/ui/routes. You will need at least two routes, one for list view and one for single view. Single view must be on same route as list view but with one additional parameter - row(record) Id.
