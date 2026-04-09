export const molecules = {
    simple: [
        {name: 'Methanol', smiles: 'CO'},
        {name: 'Ethanol', smiles: 'CCO'},
        {name: 'Acetic acid', smiles: 'CC(=O)O'},
    ],
    aromatic: [
        {name: 'Toluene', smiles: 'Cc1ccccc1'},
        {name: 'Phenol', smiles: 'Oc1ccccc1'},
        {name: 'Anthracene', smiles: 'c1ccc2cc3ccccc3cc2c1'},
    ],
    heterocycles: [
        {name: 'Pyridine', smiles: 'c1ccncc1'},
        {name: 'Indole', smiles: 'c1ccc2[nH]ccc2c1'},
        {name: 'Thiophene', smiles: 'c1ccsc1'},
    ],
    drugs: [
        {name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O'},
        {name: 'Caffeine', smiles: 'Cn1c(=O)c2c(ncn2C)n(c1=O)C'},
        {name: 'Morphine', smiles: 'CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@@H]1C5'},
    ],
    complex: [
        {name: 'Cholesterol', smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C'},
        {name: 'Glucose', smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O'},
        {name: 'Testosterone', smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@@]34C)[C@@H]1CC[C@@H]2O'},
    ],
    stereo: [
        {name: 'L-Alanine', smiles: 'N[C@@H](C)C(=O)O'},
        {name: 'D-Alanine', smiles: 'N[C@H](C)C(=O)O'},
        {name: 'L-Tryptophan', smiles: 'N[C@@H](Cc1c[nH]c2ccccc12)C(=O)O'},
    ],
};

// Reaction SMILES
export const reactions = [
    {name: 'SN2 Reaction', smiles: 'CBr.[OH-]>>CO.[Br-]'},
    {name: 'Esterification', smiles: 'CC(=O)O.CO>>CC(=O)OC.O'},
    {name: 'Finkelstein (with reagent)', smiles: "C=CCBr.[Na+].[I-]>CC(=O)C>C=CCI.[Na+].[Br-]  __{'textAboveArrow': 'acetone', 'textBelowArrow': '90%'}__"},
];

// Weight / heatmap examples with per-atom weight values
export const weightExamples = [
    {name: 'Diphenylamine Charges', smiles: 'c1ccc(Nc2ccccc2)cc1', weights: '-0.1,-0.05,0.1,-0.05,-0.1,0.3,-0.4,0.3,-0.1,-0.05,0.1,-0.05,-0.1'},
    {name: 'Aspirin Pharmacophore', smiles: 'CC(=O)Oc1ccccc1C(=O)O', weights: '0.1,0.8,0.9,0.6,0.2,-0.1,-0.2,-0.1,0.0,0.2,0.7,0.9,0.8'},
    {name: 'Caffeine Reactivity', smiles: 'Cn1c(=O)c2c(ncn2C)n(c1=O)C', weights: '0.1,-0.3,0.7,0.5,-0.2,0.3,-0.5,0.2,-0.1,0.1,-0.3,0.7,0.5,0.1'},
];

// Showcase molecules for the landing page
export const showcaseMolecules = [
    {name: 'Finkelstein Reaction', smiles: "C=CCBr.[Na+].[I-]>CC(=O)C>C=CCI.[Na+].[Br-]  __{'textAboveArrow': 'acetone', 'textBelowArrow': '90%'}__", wide: true},
    {name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O'},
    {name: 'Caffeine', smiles: 'Cn1c(=O)c2c(ncn2C)n(c1=O)C'},
    {name: 'Penicillin G', smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)Cc3ccccc3)C(=O)O)C'},
    {name: 'Cholesterol', smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C'},
    {name: 'Glucose', smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O'},
    {name: 'Dopamine', smiles: 'NCCc1ccc(O)c(O)c1'},
    {name: 'Nicotine', smiles: 'CN1CCC[C@H]1c2cccnc2'},
    {name: 'Aclidinium', smiles: 'O=C(OC1CC2CCC1[N+](C)(CCCOc1ccccc1)C2)C(O)(c1cccs1)c1cccs1'},
    {name: 'Testosterone', smiles: 'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@@]34C)[C@@H]1CC[C@@H]2O'},
];

export const heroExamples = [
    {name: 'Penicillin G', kind: 'Beta-lactam', smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)Cc3ccccc3)C(=O)O)C'},
    {name: 'Aspirin', kind: 'Molecule', smiles: 'CC(=O)Oc1ccccc1C(=O)O'},
    {name: 'Aclidinium', kind: 'Drug', smiles: 'O=C(OC1CC2CCC1[N+](C)(CCCOc1ccccc1)C2)C(O)(c1cccs1)c1cccs1'},
    {name: 'Nicotine', kind: 'Alkaloid', smiles: 'CN1CCC[C@H]1c2cccnc2'},
    {name: 'Finkelstein reaction', kind: 'Reaction', smiles: "C=CCBr.[Na+].[I-]>CC(=O)C>C=CCI.[Na+].[Br-]  __{'textAboveArrow': 'acetone', 'textBelowArrow': '90%'}__"},
];

// Playground presets organized by category
export const playgroundPresets = {
    Simple: [
        {name: 'Methanol', smiles: 'CO'},
        {name: 'Ethane', smiles: 'CC'},
        {name: 'Acetic acid', smiles: 'CC(=O)O'},
        {name: 'Water', smiles: 'O'},
    ],
    Rings: [
        {name: 'Phenol', smiles: 'Oc1ccccc1'},
        {name: 'Anthracene', smiles: 'c1ccc2cc3ccccc3cc2c1'},
        {name: 'Cyclohexane', smiles: 'C1CCCCC1'},
        {name: 'Cyclopropane', smiles: 'C1CC1'},
    ],
    Drugs: [
        {name: 'Aspirin', smiles: 'CC(=O)Oc1ccccc1C(=O)O'},
        {name: 'Caffeine', smiles: 'Cn1c(=O)c2c(ncn2C)n(c1=O)C'},
        {name: 'Morphine', smiles: 'CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@@H]1C5'},
        {name: 'Penicillin G', smiles: 'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)Cc3ccccc3)C(=O)O)C'},
    ],
    Complex: [
        {name: 'Cholesterol', smiles: 'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C'},
        {name: 'Glucose', smiles: 'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O'},
        {name: 'ATP', smiles: 'c1nc(c2c(n1)n(cn2)[C@@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)OP(=O)(O)O)O)O)N'},
    ],
    Stereo: [
        {name: 'L-Alanine', smiles: 'N[C@@H](C)C(=O)O'},
        {name: 'Nicotine', smiles: 'CN1CCC[C@H]1c2cccnc2'},
        {name: 'Thalidomide', smiles: 'O=C1CCC(N2C(=O)c3ccccc3C2=O)C(=O)N1'},
    ],
    Reactions: [
        {name: 'SN2', smiles: 'CBr.[OH-]>>CO.[Br-]'},
        {name: 'Esterification', smiles: 'CC(=O)O.CO>>CC(=O)OC.O'},
        {name: 'Diels-Alder', smiles: 'C=CC=C.C=C>>C1CC=CCC1'},
        {name: 'Amide formation', smiles: 'CC(=O)O.NCC>>CC(=O)NCC.O'},
    ],
};

export const renderOverrides = {
    "C=CCBr.[Na+].[I-]>CC(=O)C>C=CCI.[Na+].[Br-]  __{'textAboveArrow': 'acetone', 'textBelowArrow': '90%'}__": {
        bondLength: 16.8,
        fontSizeLarge: 5.4,
        padding: 20
    },
    'CC1([C@@H](N2[C@H](S1)[C@@H](C2=O)NC(=O)Cc3ccccc3)C(=O)O)C': {
        bondLength: 15.4,
        fontSizeLarge: 5.2,
        padding: 8
    },
    'C[C@H](CCCC(C)C)[C@H]1CC[C@@H]2[C@@]1(CC[C@H]3[C@H]2CC=C4[C@@]3(CC[C@@H](C4)O)C)C': {
        bondLength: 16.2,
        fontSizeLarge: 5.4,
        padding: 8
    },
    'OC[C@H]1OC(O)[C@H](O)[C@@H](O)[C@@H]1O': {
        bondLength: 17.8,
        fontSizeLarge: 5.6,
        padding: 8
    },
    'CN1CC[C@]23c4c5ccc(O)c4O[C@H]2[C@@H](O)C=C[C@H]3[C@@H]1C5': {
        bondLength: 15.6,
        fontSizeLarge: 5.2,
        padding: 8
    },
    'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@@]34C)[C@@H]1CC[C@@H]2O': {
        bondLength: 16,
        fontSizeLarge: 5.3,
        padding: 8
    },
    'c1nc(c2c(n1)n(cn2)[C@@H]3[C@@H]([C@@H]([C@H](O3)COP(=O)(O)OP(=O)(O)OP(=O)(O)O)O)O)N': {
        bondLength: 13,
        fontSizeLarge: 4.9,
        padding: 8
    }
};
