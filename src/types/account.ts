export enum AccountFlow {
  Income = 'Income',
  Outgoing = 'Outgoing'
}

export enum AccountType {
  Revenues = 'Revenues',
  Assets = 'Assets',
  Expenses = 'Expenses'
}

export enum AccountSubType {
  Donation = 'Donation',
  SalesRevenue = 'Sales Revenue',
  OfficeEquipments = 'Office Equipments',
  FixedAssets = 'Fixed Assets',
  Supplies = 'Supplies',
  MusicalEquipments = 'Musical Equipments',
  SuppliesExpenses = 'Supplies Expenses',
  RentExpenses = 'Rent Expenses',
  UtilitiesExpense = 'Utilities Expense',
  BankServices = 'Bank Services',
  OtherExpenses = 'Other Expenses',
  LocalMissionSupport = 'Local Mission Support',
  ExternalServices = 'External Services',
  SalariesExpenses = 'Salaries Expenses',
  MediaProjects = 'Media Projects'
}

export enum TransactionCategory {
  OfrendaServicioRegular = 'Ofrenda Servicio Regular',
  OfrendaMisionera = 'Ofrenda Misionera',
  OfrendaEspecial = 'Ofrenda Especial',
  OfrendaConFinEspecifico = 'Ofrenda con fin específico',
  DiezmoRegular = 'Diezmo Regular',
  DiezmoPastor = 'Diezmo Pastor',
  CotizacionMiembro = 'Cotizacion Miembro',
  ApoyoDesdeFondoNacional = 'Apoyo desde Fondo Nacional',
  VentaDeComidas = 'Venta de comidas',
  VentaDeArticulos = 'Venta de artículos',
  ContribucionAdicionalDesdeIglesiaLocal = 'Contribución adicional desde Iglesia Local',
  ContribucionDesdeFuenteExterna = 'Contribución desde Fuente Externa',
  OtrosIngresos = 'Otros Ingresos',
  CompraDeMobiliario = 'Compra de mobiliario',
  CompraDeBienesInmuebles = 'Compra de bienes inmuebles',
  CompraDeBienesMuebles = 'Compra de bienes muebles (vehiculos, ...)',
  CompraDeMaterialesEscuelaDominicalInfantil = 'Compra de materiales Escuela Dominical Infantil',
  CompraDeEquiposAudiovisuales = 'Compra de equipos audiovisuales',
  CompraDeInstrumentosMusicales = 'Compra de instrumentos musicales',
  CompraDeAlimentosEIngredientes = 'Compra de alimentos e ingredientes',
  CompraDeProductosDeLimpieza = 'Compra de productos de limpieza',
  CompraDeOtrosConsumibles = 'Compra de otros consumibles',
  CompraDeOtrosNoConsumibles = 'Compra de otros No consumibles',
  PagoDeAlquilerDeLocales = 'Pago de alquiler de locales',
  PagoDeAlquilerDeMateriales = 'Pago de alquiler de materiales',
  PagoDeHospedaje = 'Pago de hospedaje',
  PagoDeTiquetesDeTransporte = 'Pago de tiquetes de transporte',
  PagoDeEstacionamientoParking = 'Pago de estacionamiento/parking',
  PagoDeCombustible = 'Pago de combustible',
  PagoDeServiciosBasicos = 'Pago de servicios básicos',
  PagoDeAlimentacion = 'Pago de alimentación',
  PagoDeServiciosBancarios = 'Pago de servicios bancarios',
  PagoDeOtrosServicios = 'Pago de otros servicios',
  ContribucionAIglesiaLocal = 'Contribución a Iglesia Local',
  ContribucionAFondoNacional = 'Contribución a Fondo Nacional',
  ContribucionAMMMBloqueC = 'Contribución a MMM Bloque C',
  ContribucionAMMMInternacional = 'Contribución a MMM Internacional',
  AsignacionAPastorLocal = 'Asignación a Pastor local',
  OfrendaAInvitado = 'Ofrenda a invitado',
  ProyectosDeDifusion = 'Proyectos de difusión',
  AyudaSocial = 'Ayuda Social',
  OtrosEgresos = 'Otros Egresos'
}

export interface Account {
  id: string;
  flow: AccountFlow;
  type: AccountType;
  subType: AccountSubType;
  category: TransactionCategory;
  costCenter: 'Any' | 'Local' | 'National';
  internalMovement: boolean;
  active: boolean;
  dateTimeCreated?: string;
  userCreated?: string;
  dateTimeModified?: string;
  userModified?: string;
  isDeleted: boolean;
}